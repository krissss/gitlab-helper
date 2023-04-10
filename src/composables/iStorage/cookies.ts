// 参考： https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/packages/nuxt/src/runtime/storages.ts
import { StorageLike } from '@vueuse/core'
import { CookieOptions } from '#app'

const defaultCookieOptions: CookieOptions = {
  encode: encodeURIComponent,
  decode: decodeURIComponent,
}

export const useIStorageCookie = (options?: Omit<CookieOptions<string | null>, 'encode' | 'decode'>): StorageLike => {
  options = {
    ...defaultCookieOptions,
    ...options,
  }

  return {
    getItem(key: string) {
      return useCookie(key, options).value
    },
    setItem(key: string, value: string) {
      useCookie(key, options).value = value
    },
    removeItem(key: string) {
      useCookie(key, options).value = null
    },
  }
}
