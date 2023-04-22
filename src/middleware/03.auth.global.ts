export default defineNuxtRouteMiddleware(to => {
  const storeUser = useStoreUser()
  if (storeUser.isLogin) {
    // 已登录
    return
  }
  // 未登录
  const noNeedLogin = ['/', '/index', '/login']
  if (noNeedLogin.includes(to.path)) {
    // 登录页忽略
    return
  }
  messageToast.error('请先登录')
  return navigateTo('/login')
})
