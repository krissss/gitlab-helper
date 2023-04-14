import dayjs, { Dayjs } from 'dayjs'

export default dayjs

export const dayjsToDate = (range: Dayjs[]) => {
  return range.map(item => item.toDate())
}

export const dayjsToDateIsoString = (range: Dayjs[] | Date[] | string[]) => {
  return range.map(item => (typeof item === 'string' ? item : item.toISOString()))
}

export const dayjsTodayRange = (): [Dayjs, Dayjs] => {
  return [dayjs().startOf('day'), dayjs().endOf('day')]
}

export const dayjsYesterdayRange = (): [Dayjs, Dayjs] => {
  return [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')]
}

export const dayjsYesterdayToTodayRange = (): [Dayjs, Dayjs] => {
  return [dayjs().subtract(1, 'day').startOf('day'), dayjs().endOf('day')]
}

export const dayjsThisWeekRange = (): [Dayjs, Dayjs] => {
  return [dayjs().startOf('week').add(1, 'day'), dayjs().endOf('week').add(1, 'day')]
}

export const dayjsThisMonthRange = (): [Dayjs, Dayjs] => {
  return [dayjs().startOf('month'), dayjs().endOf('month')]
}
