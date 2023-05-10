interface GistInfo {
  token: string
  gist: string
  last_updated: null | string
}

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      setting: useIStorage('settingSync', {
        github: {} as Partial<GistInfo>,
        gitee: {} as Partial<GistInfo>,
      }),
    }
  },
})
