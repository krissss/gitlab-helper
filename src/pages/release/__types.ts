export interface Project {
  id: number
  project: string
  compare_source_branch: string
  compare_target_branch: string
  last_tag?: string | null
  compare_commit_diff_count?: number | null
  updated_at?: string
}

const stepTypes = ['createMR', 'addComment', 'merge', 'createTag', 'refreshProject'] as const
export type StepType = (typeof stepTypes)[number]
const stepStatusValues = ['wait', 'process', 'finish', 'error', 'success'] as const
type StepStatus = (typeof stepStatusValues)[number]
const releaseType = ['major', 'minor', 'patch'] as const
export type ReleaseType = (typeof releaseType)[number]
export const releaseTypeOptions: Array<{
  label: string
  value: ReleaseType | ''
}> = [
  { label: '自定义', value: '' },
  { label: '大版本-major', value: 'major' },
  { label: '次版本-minor', value: 'minor' },
  { label: '补丁-patch', value: 'patch' },
]

export interface ReleasePublishStepInfoItem {
  title: string
  status: StepStatus
}

export type ReleasePublishStepInfo = Partial<Record<StepType, ReleasePublishStepInfoItem>>
