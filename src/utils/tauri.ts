// tauri 兼容的 api
import { open } from '@tauri-apps/api/shell'
import { emit } from '@tauri-apps/api/event'

export const tauriIsIn = (): boolean => {
  return !!window.__TAURI__
}

export const tauriOpen = async (blankUrl: string) => {
  if (tauriIsIn()) {
    await open(blankUrl)
    return
  }
  window.open(blankUrl, '_blank')
}

export const tauriCheckUpdate = async () => {
  if (!tauriIsIn()) {
    return
  }
  await emit('tauri://update')
}
