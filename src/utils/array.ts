export function arrayUnshiftKeepLength<T>(arr: T[], item: T, maxLength: number) {
  let newArr = [...new Set([item].concat(arr))].filter(item => item !== null && item !== undefined)
  if (newArr.length > maxLength) {
    newArr = newArr.splice(maxLength - 1, newArr.length - maxLength)
  }
  return newArr
}
