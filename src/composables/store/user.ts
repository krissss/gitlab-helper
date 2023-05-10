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
      messageConfirmCB('退出登录将清空所有配置，请提前做好备份', async () => {
        await useIStorageSetting.cleanAll({
          reload: false,
        })
        navigateTo('/')
        messageToast.success('退出登录成功')
        await sleep(500)
        window.location.reload()
      })
    },
  },
})
