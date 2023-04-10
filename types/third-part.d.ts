import dayjs from 'dayjs'

declare module '@nuxt/types' {
  interface Context {
    $dayjs: typeof dayjs
  }
  interface NuxtAppOptions {
    $dayjs: typeof dayjs
  }
}
