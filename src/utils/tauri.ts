// tauri 兼容的 api
import { open } from '@tauri-apps/api/shell'

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
