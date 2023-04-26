export class loading {
  private static instance: any
  public static show() {
    this.instance = null
    setTimeout(() => {
      if (this.instance === 0) {
        return
      }
      this.instance = ElLoading.service()
    }, 200)
  }

  public static hide() {
    if (this.instance) {
      this.instance.close()
    }
    this.instance = 0
  }
}
