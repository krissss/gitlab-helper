export function sleep(ts: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ts)
  })
}
