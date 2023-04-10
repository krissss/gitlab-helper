export default defineNuxtRouteMiddleware(to => {
  const storeUser = useStoreUser()
  if (storeUser.isLogin) {
    // 已登录
    return
  }
  // 未登录
  if (to.path === '/login') {
    // 登录页忽略
    return
  }
  return navigateTo('/login')
})
