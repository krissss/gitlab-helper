export default defineNuxtRouteMiddleware((to) => {
  const storeUser = useStoreUser()
  if (storeUser.isLogin) {
    // 已登录
    return
  }
  // 未登录
  const noNeedLogin = ['/', '/index', '/login', '/setting-sync']
  if (noNeedLogin.includes(to.path)) {
    // 登录页忽略
    return
  }

  const { $i18n } = useNuxtApp()
  messageToast.error($i18n.t('请先登录'))
  return navigateTo('/login')
})
