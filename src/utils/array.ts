// 在数组前添加元素，并保持元素长度
export function arrayUnshiftKeepLength<T>(arr: T[], item: T, maxLength: number) {
  let newArr = [...new Set([item].concat(arr))].filter(item => item !== null && item !== undefined)
  if (newArr.length > maxLength) {
    newArr = newArr.splice(0, maxLength)
  }
  return newArr
}
