import { MaybeComputedRef, RemovableRef, useStorage as useVueUseStorage, UseStorageOptions } from '@vueuse/core'
import { useIStorageCookie } from './cookies'

const PREFIX = 'MyApp-'
enum storageType {
  cookies,
  localStorage,
  sessionStorage,
}
enum storageKey {
  user,
  gitlabUrl,
  gitlabToken,
  pageMergeRequestCheck,
}

export const useIStorage = <T>(
  key: keyof typeof storageKey,
  defaults: MaybeComputedRef<T>,
  storage: keyof typeof storageType = 'cookies',
  options: UseStorageOptions<T> = {}
): RemovableRef<T> => {
  let newStorage
  if (storage === 'localStorage') {
    newStorage = undefined
  } else if (storage === 'sessionStorage') {
    newStorage = sessionStorage
  } else if (storage === 'cookies') {
    newStorage = useIStorageCookie()
  }

  return useVueUseStorage<T>(PREFIX + key, defaults, newStorage, {
    ...options,
    mergeDefaults: true,
  })
}
