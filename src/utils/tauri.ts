// tauri 兼容的 api
import { open } from '@tauri-apps/api/shell'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { getVersion } from '@tauri-apps/api/app'
import { checkUpdate, installUpdate, onUpdaterEvent } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'

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

export const tauriVersion = async () => {
  if (!tauriIsIn()) {
    return ''
  }
  return await getVersion()
}

let updaterUnListen: UnlistenFn | null = null
export const tauriCheckUpdater = async () => {
  if (!tauriIsIn() || updaterUnListen) {
    // eslint-disable-next-line no-console
    console.debug('skip check update')
    return
  }

  updaterUnListen = await onUpdaterEvent(({ error, status }) => {
    // This will log all updater events, including status updates and errors.
    // eslint-disable-next-line no-console
    console.debug('Updater event', error, status)
  })

  try {
    const { shouldUpdate, manifest } = await checkUpdate()
    // eslint-disable-next-line no-console
    console.debug({ shouldUpdate, manifest })

    if (shouldUpdate && manifest) {
      const confirm = await messageUpdater(manifest, await tauriVersion())
      if (confirm) {
        // Install the update. This will also restart the app on Windows!
        await installUpdate()
        // On macOS and Linux you will need to restart the app manually.
        // You could use this step to display another confirmation dialog.
        await relaunch()
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    updaterUnListen()
    updaterUnListen = null
  }
}
