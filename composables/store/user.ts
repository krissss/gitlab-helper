export const useStoreUser = definePiniaStore('user', {
  state: () => {
    return {
      user: useStorageBrowser('user', {}) as unknown as TypeGitlabUser | null,
    }
  },
  getters: {
    isLogin: state => state.user && state.user.id,
    name: state => state.user?.name,
    avatar_url: state => state.user?.avatar_url,
  },
  actions: {
    async login() {
      const { data: user } = await useHttpGitlab.get<TypeGitlabUser>('/api/v4/user')
      if (user.value) {
        this.user = user.value
        return true
      }
      return false
    },
  },
})
