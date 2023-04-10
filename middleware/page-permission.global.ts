export default defineNuxtRouteMiddleware(to => {
  const path = to.path
  if (path.includes('/_store')) {
    // 不允许访问 _store.ts
    return navigateTo('/')
  }
  if (path.includes('/_components/')) {
    // 不允许访问页面下的组件
    return navigateTo('/')
  }
})
