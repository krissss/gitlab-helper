export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: [] as TypeGitlabMergeRequest[],
      setting: useIStorage('pageMergeRequestMerge', {
        note: 'ok',
        mounted_refresh: false,
      }),
    }
  },
  actions: {
    async fetchList() {
      const storeUser = useStoreUser()
      const { data } = await useHttpGitlab.get<TypeGitlabMergeRequest[]>('/api/v4/merge_requests', {
        assignee_id: storeUser.id,
        state: 'opened',
      })
      this.list = data.value ?? []
    },
    async merge(mr: TypeGitlabMergeRequest) {
      // 添加 comment
      const { error: noteError } = await useHttpGitlab.post(
        `/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/notes`,
        {
          body: this.setting.note,
        }
      )
      if (noteError.value) {
        throw new Error('添加评论失败')
      }
      // 合并
      const { error: mergeError } = await useHttpGitlab.put(
        `/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/merge`
      )
      if (mergeError.value) {
        throw new Error('合并 MR 失败')
      }
    },
  },
})
