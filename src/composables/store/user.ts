import { DEFAULT_AUTO_UPDATE } from '~/constants'

export const useStoreUser = definePiniaStore('user', {
  state: () => {
    return {
      user: useIStorage<Partial<TypeGitlab.User>>('user', {}),
      setting: useIStorage('userSetting', {
        checkUpdate: null as boolean | null,
      }),
    }
  },
  getters: {
    isLogin: state => state.user && state.user.id,
    name: state => state.user.name,
    avatar_url: state => state.user.avatar_url,
    id: state => state.user.id,
    autoUpdate: state => (state.setting.checkUpdate === null ? DEFAULT_AUTO_UPDATE : state.setting.checkUpdate),
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
