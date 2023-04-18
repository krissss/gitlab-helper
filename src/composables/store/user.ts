export const useStoreUser = definePiniaStore('user', {
  state: () => {
    return {
      user: useIStorage<Partial<TypeGitlab.User>>('user', {}),
    }
  },
  getters: {
    isLogin: state => state.user && state.user.id,
    name: state => state.user.name,
    avatar_url: state => state.user.avatar_url,
    id: state => state.user.id,
  },
  actions: {
    async login() {
      const { data: user } = await useHttpGitlab.get<TypeGitlab.User>('/api/v4/user')
      if (user.value) {
        this.user = user.value
        return true
      }
      return false
    },
    logout() {
      this.user = {}
      navigateTo('/')
    },
  },
})
