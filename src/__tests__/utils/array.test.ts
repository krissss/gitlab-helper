import { describe, expect, test } from 'vitest'

describe('arrayUnshiftKeepLength', () => {
  test('是在数组前添加的', () => {
    const arr = [1, 2]
    const newArr = arrayUnshiftKeepLength(arr, 3, 10)
    expect(newArr).toEqual([3, 1, 2])
  })

  test('没有改变原数组', () => {
    const arr = [1, 2]
    arrayUnshiftKeepLength(arr, 3, 10)
    expect(arr).toEqual([1, 2])
  })

  test('可以过滤空数据', () => {
    const arr = [1, 2]
    const newArr = arrayUnshiftKeepLength(arr, null, 10)
    expect(newArr).toEqual([1, 2])
  })

  test('能够正确保留长度', () => {
    let arr = [1, 2]
    arr = arrayUnshiftKeepLength(arr, 3, 4)
    expect(arr).toEqual([3, 1, 2])
    arr = arrayUnshiftKeepLength(arr, 4, 4)
    expect(arr).toEqual([4, 3, 1, 2])
    arr = arrayUnshiftKeepLength(arr, 5, 4)
    expect(arr).toEqual([5, 4, 3, 1])
    arr = arrayUnshiftKeepLength(arr, 6, 4)
    expect(arr).toEqual([6, 5, 4, 3])
  })

  test('支持对象等复杂类型', () => {
    let arr = [{ a: 1 }, { a: 2 }]
    arr = arrayUnshiftKeepLength(arr, { a: 3 }, 4)
    expect(arr).toEqual([{ a: 3 }, { a: 1 }, { a: 2 }])
    arr = arrayUnshiftKeepLength(arr, { a: 4 }, 4)
    expect(arr).toEqual([{ a: 4 }, { a: 3 }, { a: 1 }, { a: 2 }])
    arr = arrayUnshiftKeepLength(arr, { a: 5 }, 4)
    expect(arr).toEqual([{ a: 5 }, { a: 4 }, { a: 3 }, { a: 1 }])
    arr = arrayUnshiftKeepLength(arr, { a: 6 }, 4)
    expect(arr).toEqual([{ a: 6 }, { a: 5 }, { a: 4 }, { a: 3 }])
  })
})
