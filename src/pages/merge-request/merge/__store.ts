export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: [] as TypeGitlab.MergeRequest[],
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
      this.list = data.value ?? []
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
