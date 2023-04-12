export interface Project {
  id: number
  project: string
  compare_source_branch: string
  compare_target_branch: string
  last_tag?: string | null
  compare_commit_diff_count?: number | null
  updated_at?: string
}

const stepTypes = ['createMR', 'addComment', 'merge', 'createTag'] as const
export type StepType = (typeof stepTypes)[number]
const stepStatusValues = ['wait', 'process', 'finish', 'error', 'success'] as const
type StepStatus = (typeof stepStatusValues)[number]

export interface ReleasePublishStepInfoItem {
  title: string
  status: StepStatus
}

export type ReleasePublishStepInfo = Partial<Record<StepType, ReleasePublishStepInfoItem>>
