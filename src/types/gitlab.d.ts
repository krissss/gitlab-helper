declare module TypeGitlab {
  declare interface User {
    id: number
    username: string
    name: string
    avatar_url: string
    web_url: string
  }

  declare interface Project {
    id: number
    name: string
    description: string
    path: string
    url: string
    private: boolean
    path_with_namespace: string
  }

  declare interface MergeRequest {
    id: number
    iid: number
    user_notes_count: number
    title: string
    source_branch: string
    target_branch: string
    created_at: string
    has_conflicts: boolean
    web_url: string
    references: {
      full: string
    }
    project_id: number
    work_in_progress: boolean
    force_remove_source_branch: boolean
  }

  declare interface BranchCompare {
    commits: Array<{
      id: string
    }>
  }

  declare interface Tag {
    name: string
  }
}
