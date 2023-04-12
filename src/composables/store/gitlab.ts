export const useStoreGitlab = definePiniaStore('gitlab', {
  state: () => {
    return {
      url: useIStorage('gitlabUrl', 'https://gitlab.com/'),
      access_token: useIStorage('gitlabToken', ''),
    }
  },
  getters: {
    urlNoSuffix(state) {
      return state.url.replace(/\/$/, '')
    },
  },
  actions: {
    getProjectLink(project: string) {
      return `${this.urlNoSuffix}/${project}`
    },
    getTagLink(project: string) {
      return `${this.urlNoSuffix}/${project}/-/tags`
    },
    getCompareLink(project: string, source: string, target: string) {
      return `${this.urlNoSuffix}/${project}/-/compare/${target}...${source}`
    },
    getMergeRequestLink(project: string, iid: number) {
      return `${this.urlNoSuffix}/${project}/-/merge_requests/${iid}`
    },
  },
})
