import { Dayjs } from 'dayjs'

export interface Project {
  id: number
  project: string
  last_check_range?: [string, string]
  updated_at: string
  error_iids: number[]
}

export interface CheckInfo {
  check: number
  errors: number[]
}

export type CheckRange = [Dayjs, Dayjs]
