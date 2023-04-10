export const useStoreProject = definePiniaStore('project', {
  state: () => {
    return {
      list: [] as Array<TypeGitlabProject>,
    }
  },
  actions: {
    async fetchList() {
      const { data: list } = await useHttpGitlab.get<TypeGitlabProject[]>('/api/v4/projects', {
        archived: false,
        simple: true,
        // order_by: 'updated_at',
        // sort: 'asc',
        membership: true,
      })
      if (list.value) {
        this.list = list.value
      }
    },
  },
})
