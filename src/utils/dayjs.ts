import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export default dayjs

export function dayjsToDate(range: Dayjs[]) {
  return range.map(item => item.toDate())
}

export function dayjsToDateIsoString(range: Dayjs[] | Date[] | string[]) {
  return range.map(item => (typeof item === 'string' ? item : item.toISOString()))
}

export function dayjsTodayRange(): [Dayjs, Dayjs] {
  return [dayjs().startOf('day'), dayjs().endOf('day')]
}

export function dayjsYesterdayRange(): [Dayjs, Dayjs] {
  return [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')]
}

export function dayjsYesterdayToTodayRange(): [Dayjs, Dayjs] {
  return [dayjs().subtract(1, 'day').startOf('day'), dayjs().endOf('day')]
}

export function dayjsThisWeekRange(): [Dayjs, Dayjs] {
  return [dayjs().startOf('week').add(1, 'day'), dayjs().endOf('week').add(1, 'day')]
}

export function dayjsLastWeekRange(): [Dayjs, Dayjs] {
  return [
    dayjs().subtract(1, 'week').startOf('week').add(1, 'day'),
    dayjs().subtract(1, 'week').endOf('week').add(1, 'day'),
  ]
}

export function dayjsThisMonthRange(): [Dayjs, Dayjs] {
  return [dayjs().startOf('month'), dayjs().endOf('month')]
}
