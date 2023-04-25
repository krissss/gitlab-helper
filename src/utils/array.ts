export const arrayUnshiftKeepLength = <T>(arr: T[], item: T, maxLength: number) => {
  if (arr.findIndex(i => i === item) > -1) {
    return
  }
  arr.unshift(item)
  if (arr.length > maxLength) {
    arr.pop()
  }
}
