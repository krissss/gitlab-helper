import type { MaybeComputedRef, RemovableRef, UseStorageOptions } from '@vueuse/core'
import { useStorage as useVueUseStorage } from '@vueuse/core'
import { STORAGE_KEYS, STORAGE_PREFIX } from '~/constants'

type StorageKey = (typeof STORAGE_KEYS)[number]

export function useIStorage<T>(key: StorageKey,
  defaults: MaybeComputedRef<T>,
  options: UseStorageOptions<T> = {}): RemovableRef<T> {
  return useVueUseStorage<T>(STORAGE_PREFIX + key, defaults, undefined, {
    ...options,
    mergeDefaults: true,
  })
}

export const useIStorageSetting = {
  export() {
    const data: {
      [key: string]: any
    } = {}
    for (const key of STORAGE_KEYS) {
      const value = useIStorage(key, null)
      if (value.value) {
        data[key] = value.value
      }
    }

    const link = document.createElement('a')
    link.download = `config-${dayjs().format('YYYYMMDDHHmm')}.json`
    link.href = `data:text/plain,${JSON.stringify(data)}`
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
          for (const key of STORAGE_KEYS) {
            if (!data[key]) {
              continue
            }
            const value = useIStorage(key, null)
            value.value = data[key]
          }

          window.location.reload() // 重新渲染页面，使 storage 生效
        }
        catch (e) {
          console.error(e)
        }
      }
      reader.readAsText(files[0])
    }

    input.click()
  },
}
