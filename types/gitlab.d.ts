declare type TypeGitlabUser = {
  id: number
  username: string
  name: string
  avatar_url: string
  web_url: string
}

declare type TypeGitlabProject = {
  id: number
  name: string
  description: string
  path: string
  url: string
  private: boolean
  path_with_namespace: string
}

declare type TypeGitlabMergeRequest = {
  id: number
  user_notes_count: number
}
