export const usePageStore = definePiniaStore('page', {
  state: () => {
    return {
      list: useIStorage<TypeGitlabProject[]>('pageMergeRequestCheck', []),
    }
  },
  actions: {
    add(projects: TypeGitlabProject[]) {
      projects.forEach(project => {
        const index = this.list.findIndex(item => item.id === project.id)
        if (index > -1) {
          this.list.splice(index, 1)
        }
        this.list.unshift(project)
      })
    },
    remove(project: TypeGitlabProject) {
      const index = this.list.findIndex(item => item.id === project.id)
      this.list.splice(index, 1)
    },
  },
})
