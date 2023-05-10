interface GistInfo {
  token: string
  gist: string
  url?: string
  last_updated?: string
}

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      setting: useIStorage('pageSettingSync', {
        github: {} as Partial<GistInfo>,
        gitee: {} as Partial<GistInfo>,
      }),
    }
  },
  actions: {
    save(type: 'github' | 'gitee', setting: Partial<GistInfo>) {
      this.setting[type] = setting
    },
  },
})
