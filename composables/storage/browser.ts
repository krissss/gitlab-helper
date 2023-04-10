import { useStorage as useVueUseStorage } from '@vueuse/core'

const PREFIX = 'MyApp-'
enum useStorageBrowserEnum {
  'user',
  'gitlab-url',
  'gitlab-ak',
  'service.mrCheck',
}

export const useStorageBrowser = (key: keyof typeof useStorageBrowserEnum, defaults: any) => {
  return useVueUseStorage(PREFIX + key, defaults, undefined, {
    mergeDefaults: true,
  })
}
