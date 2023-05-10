import type { MaybeRefOrGetter, RemovableRef, UseStorageOptions } from '@vueuse/core'
import { useStorage as useVueUseStorage } from '@vueuse/core'
import type { STORAGE_KEY } from '~/constants'
import { STORAGE_KEYS, STORAGE_PREFIX } from '~/constants'

type StorageKey = (typeof STORAGE_KEYS)[number]

export function useIStorage<T>(
  key: StorageKey,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  return useVueUseStorage<T>(STORAGE_PREFIX + key, defaults, undefined, {
    ...options,
    mergeDefaults: true,
  })
}

export const useIStorageSetting = {
  getAllData(): string {
    const data: {
      [key: string]: any
    } = {}
    for (const key of STORAGE_KEYS) {
      const value = useIStorage(key, null)
      if (value.value) {
        data[key] = jsonSafeParse(value.value)
      }
    }
    return JSON.stringify(data)
  },
  async setAllData(json: string, config: {
    reload?: boolean
    ignoreKeys?: Array<STORAGE_KEY>
  } = {}) {
    config = Object.assign({
      reload: true,
      ignoreKeys: [],
    }, config)
    const data = JSON.parse(json)
    for (const key of STORAGE_KEYS) {
      if (config.ignoreKeys!.includes(key)) {
        continue
      }
      if (!data[key]) {
        continue
      }
      const value = useIStorage<string | null>(key, null)
      value.value = jsonSafeStringify(data[key])
    }
    messageToast.success('配置更新成功')
    await promiseSleep(1000)

    if (config.reload) {
      window.location.reload() // 重新渲染页面，使 storage 生效
    }
  },
  async cleanAll(config: {
    reload?: boolean
  } = {}) {
    config = Object.assign({
      reload: true,
    }, config)

    for (const key of STORAGE_KEYS) {
      const value = useIStorage(key, null)
      value.value = null
    }
    messageToast.success('配置清理成功')
    await promiseSleep(1000)

    if (config.reload) {
      window.location.reload() // 重新渲染页面，使 storage 生效
    }
  },
}
