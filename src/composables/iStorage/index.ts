import { MaybeComputedRef, RemovableRef, useStorage as useVueUseStorage, UseStorageOptions } from '@vueuse/core'
import { useIStorageCookie } from './cookies'

const PREFIX = 'MyApp-'

const storageTypes = ['cookies', 'localStorage', 'sessionStorage'] as const
type StorageType = (typeof storageTypes)[number]
const storageKeys = ['user', 'gitlabUrl', 'gitlabToken', 'pageMergeRequestCheck'] as const
type StorageKey = (typeof storageKeys)[number]

const DEFAULT_STORAGE: StorageType = 'localStorage'

export const useIStorage = <T>(
  key: StorageKey,
  defaults: MaybeComputedRef<T>,
  storage: StorageType = DEFAULT_STORAGE,
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

export const useIStorageSetting = {
  export() {
    const data: {
      [key: string]: any
    } = {}
    for (const key of storageKeys) {
      const value = useIStorage(key, null)
      if (value.value) {
        data[key] = value.value
      }
    }

    const link = document.createElement('a')
    link.download = `config-${dayjs().format('YYYYMMDDHHmm')}.json`
    link.href = 'data:text/plain,' + JSON.stringify(data)
    link.click()
  },
  import() {
    const input: HTMLInputElement = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = (event: any) => {
      const files = event.target.files
      if (!files || !files.length) {
        return
      }

      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result)
          for (const key of storageKeys) {
            if (!data[key]) {
              continue
            }
            const value = useIStorage(key, null)
            value.value = data[key]
          }

          window.location.reload() // 重新渲染页面，使 storage 生效
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
        }
      }
      reader.readAsText(files[0])
    }

    input.click()
  },
}
