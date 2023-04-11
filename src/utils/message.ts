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

export const messageConfirm = {
  show(message: string, title = '提示', type: ToastType = 'warning') {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
    })
  },
}
