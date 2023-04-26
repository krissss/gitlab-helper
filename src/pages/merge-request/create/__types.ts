export interface Assignee {
  id: number
  name: string
}

export interface Project {
  id: number
  project: string
  last_branch_sources: string[]
  last_branch_targets: string[]
  last_assignee_list: Assignee[]
  last_mr_created: number[]
}

export type ProjectOperateKey = keyof Pick<
  Project,
  'last_branch_sources' | 'last_branch_targets' | 'last_assignee_list' | 'last_mr_created'
>
