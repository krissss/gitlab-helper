import type { UpdateManifest } from '@tauri-apps/api/updater'

type ToastType = 'success' | 'error' | 'warning' | 'info'

export const messageToast = {
  show(message: string, type: ToastType) {
    ElMessage({
      message,
      type,
      showClose: true,
      offset: 65,
    })
  },
  error(msg: string) {
    this.show(msg, 'error')
  },
  success(msg: string) {
    this.show(msg, 'success')
  },
  warning(msg: string) {
    this.show(msg, 'warning')
  },
  info(msg: string) {
    this.show(msg, 'info')
  },
}

export function messageConfirm(message: string, title: string | null = null): Promise<boolean> {
  return new Promise((resolve) => {
    ElMessageBox.confirm(message, title || '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

export function messageConfirmCB(message: string, doFn: Function, title: string | null = null) {
  messageConfirm(message, title).then((ok) => {
    if (ok) {
      doFn()
    }
  })
}

export function messageUpdater(manifest: UpdateManifest, currentVersion: string) {
  return new Promise((resolve) => {
    const timeFormatted = dayjs(manifest.date.replace('+00:00:00', '+00:00')).format('YYYY-MM-DD HH:mm:ss')
    const message = `
      版本：${currentVersion} -> ${manifest.version}<br>
      日期：${timeFormatted}<br>
      内容：${manifest.body}
    `
    ElMessageBox.confirm(message, '新版本已发布', {
      confirmButtonText: '升级',
      cancelButtonText: '取消',
      type: 'info',
      dangerouslyUseHTMLString: true,
    })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}
