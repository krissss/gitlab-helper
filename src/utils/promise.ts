export function promiseSleep(ts: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ts)
  })
}
