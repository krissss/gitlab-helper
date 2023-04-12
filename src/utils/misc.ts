export const sleep = (ts: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ts)
  })
}
