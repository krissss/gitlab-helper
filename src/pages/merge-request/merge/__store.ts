type ListItem = TypeGitlab.MergeRequest & {
  created_at_relative_time: string
  commits_count: string
  changes_count: string
}

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: [] as ListItem[],
      setting: useIStorage('pageMergeRequestMerge', {
        note: 'ok',
        mounted_refresh: false,
        fetch_size: 20,
      }),
    }
  },
  actions: {
    async fetchList() {
      const storeUser = useStoreUser()
      const { data } = await useHttpGitlab.get<TypeGitlab.MergeRequest[]>('/api/v4/merge_requests', {
        scope: 'all',
        assignee_id: storeUser.id,
        state: 'opened',
        per_page: this.setting.fetch_size,
      })
      const dayjs = useDayjs()
      this.list = (data.value ?? []).map((item) => {
        return {
          ...item,
          ...{
            created_at_relative_time: dayjs(item.created_at).fromNow(),
            commits_count: '-',
            changes_count: '-',
          },
        }
      })
      // 异步并发获取 commits/changes
      const tasks: Promise<any>[] = []
      this.list.forEach((item) => {
        tasks.push(this.updateCommitsCount(item))
        tasks.push(this.updateChangesCounts(item))
      })
      Promise.all(tasks).catch(() => {
        // 异常忽略
      })
    },
    async updateChangesCounts(item: ListItem) {
      // 更新 changes_count
      const { data } = await useHttpGitlab.get<TypeGitlab.MergeRequestSingle>(
        `/api/v4/projects/${item.project_id}/merge_requests/${item.iid}`,
      )
      if (data.value) {
        item.changes_count = data.value.changes_count
      }
    },
    async updateCommitsCount(item: ListItem) {
      const { data } = await useHttpGitlab.get<[]>(
        `/api/v4/projects/${item.project_id}/merge_requests/${item.iid}/commits`,
      )
      if (data.value) {
        item.commits_count = data.value.length.toString()
      }
    },
    async merge(mr: TypeGitlab.MergeRequest) {
      // 添加 comment
      const { error: noteError } = await useHttpGitlab.post(
        `/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/notes`,
        {
          body: this.setting.note,
        },
      )
      if (noteError.value) {
        throw new Error('添加评论失败')
      }
      // 合并
      const { error: mergeError } = await useHttpGitlab.put(
        `/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/merge`,
        {
          should_remove_source_branch: mr.force_remove_source_branch,
        },
      )
      if (mergeError.value) {
        throw new Error('合并 MR 失败')
      }
    },
  },
})
