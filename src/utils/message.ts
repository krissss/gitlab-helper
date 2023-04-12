type ToastType = 'success' | 'error' | 'warning' | 'info'

export const messageToast = {
  show(message: string, type: ToastType) {
    ElMessage({
      message,
      type,
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

export const messageConfirm = (message: string, title: string | null = null): Promise<boolean> => {
  return new Promise(resolve => {
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

export const messageConfirmCB = (message: string, doFn: Function, title: string | null = null) => {
  messageConfirm(message, title).then(ok => {
    if (ok) {
      doFn()
    }
  })
}
