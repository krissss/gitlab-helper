import type { Project } from './__types'

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: useIStorage<Project[]>('pageMergeRequestCreate', []),
    }
  },
  getters: {
    ids: state => state.list.map(item => item.id),
  },
  actions: {
    add(projects: TypeGitlab.Project[]) {
      projects.forEach((project) => {
        const index = this.list.findIndex(item => item.id === project.id)
        if (index > -1) {
          this.list.splice(index, 1)
        }
        this.list.unshift({
          id: project.id,
          project: project.path_with_namespace,
          last_branch_sources: [],
          last_branch_targets: [],
          last_assignee_list: [],
          last_mr_created: [],
        })
      })
    },
    update(project: Project) {
      const index = this.list.findIndex(item => item.id === project.id)
      if (index > -1) {
        for (const key in project) {
          // @ts-expect-error index key
          this.list[index][key] = project[key]
        }
      }
    },
    remove(project: Project) {
      const index = this.list.findIndex(item => item.id === project.id)
      this.list.splice(index, 1)
    },
    async searchBranch(project: string, search: string) {
      const { data } = await useHttpGitlab.get<TypeGitlab.Branch[]>(
        `/api/v4/projects/${encodeURIComponent(project)}/repository/branches`,
        {
          search,
        },
      )
      if (data.value) {
        return data.value.map(item => item.name)
      }
      return []
    },
    async searchAssigneeList(project: string, query: string) {
      const { data } = await useHttpGitlab.get<TypeGitlab.User[]>(
        `/api/v4/projects/${encodeURIComponent(project)}/members/all`,
        {
          query,
        },
      )
      if (data.value) {
        return data.value.map(item => ({ id: item.id, name: item.name }))
      }
      return []
    },
    async createMergeRequest(
      project: string,
      source: string,
      target: string,
      assigneeId: number,
      title: string,
      description: string,
      removeSource: boolean,
    ) {
      const { data } = await useHttpGitlab.post<TypeGitlab.MergeRequest>(
        `/api/v4/projects/${encodeURIComponent(project)}/merge_requests`,
        {
          source_branch: source,
          target_branch: target,
          title,
          assignee_id: assigneeId,
          description,
          remove_source_branch: removeSource,
        },
      )
      return unref(data)
    },
  },
})
