export const useStoreService = definePiniaStore('service', {
  state: () => {
    return {
      mrCheck: useStorageBrowser('service.mrCheck', []) as unknown as Array<TypeGitlabProject>,
    }
  },
  actions: {
    mrCheckAdd(projects: Array<TypeGitlabProject>) {
      projects.forEach(project => {
        const index = this.mrCheck.findIndex(item => item.id === project.id)
        if (index > -1) {
          this.mrCheck.splice(index, 1)
        }
        this.mrCheck.unshift(project)
      })
    },
    mrCheckRemove(project: TypeGitlabProject) {
      const index = this.mrCheck.findIndex(item => item.id === project.id)
      this.mrCheck.splice(index, 1)
    },
  },
})
