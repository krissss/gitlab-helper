import type { Project } from './__types'

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: useIStorage<Project[]>('pageRelease', []),
      setting: useIStorage('pageReleaseSetting', {
        mr_title: 'Merge {source} to {target}',
        mr_note: 'ok',
        mr_disable: false,
        tag_disable: false,
        after_open: '',
      }),
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
          compare_source_branch: 'snapshot',
          compare_target_branch: 'master',
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
    async refresh(project: Project) {
      const { data: compareData } = await useHttpGitlab.get<TypeGitlab.BranchCompare>(
        `/api/v4/projects/${encodeURIComponent(project.project)}/repository/compare`,
        {
          from: project.compare_target_branch,
          to: project.compare_source_branch,
        },
      )
      project.compare_commit_diff_count = compareData.value ? compareData.value.commits.length : -1
      const { data: tagData } = await useHttpGitlab.get<TypeGitlab.Tag[]>(
        `/api/v4/projects/${encodeURIComponent(project.project)}/repository/tags`,
      )
      if (tagData.value && tagData.value.length > 0) {
        const lastTag = tagData.value[0]
        project.last_tag = lastTag.name
        project.last_tag_title = lastTag.commit.title
      }
      project.updated_at = dayjs().format('YYYY/MM/DD HH:mm:ss')

      this.update(project)
    },
    async refreshAll() {
      const tasks = []
      for (const project of this.list) {
        tasks.push(this.refresh(project))
      }
      await Promise.all(tasks)
    },
    async createMergeRequest(
      project: string,
      sourceBranch: string,
      targetBranch: string,
      title: string,
      extra: object = {},
    ) {
      const { data, error } = await useHttpGitlab.post<TypeGitlab.MergeRequest>(
        `/api/v4/projects/${encodeURIComponent(project)}/merge_requests`,
        Object.assign({ source_branch: sourceBranch, target_branch: targetBranch, title }, extra),
      )
      if (error.value || !data.value) {
        throw new Error('创建 MR 失败')
      }
      return data.value.iid
    },
    async addComment(project: string, iid: number, body: string) {
      const { error } = await useHttpGitlab.post(
        `/api/v4/projects/${encodeURIComponent(project)}/merge_requests/${iid}/notes`,
        {
          body,
        },
      )
      if (error.value) {
        throw new Error('添加评论失败')
      }
    },
    async mergeRequest(project: string, iid: number) {
      const { error } = await useHttpGitlab.put(
        `/api/v4/projects/${encodeURIComponent(project)}/merge_requests/${iid}/merge`,
      )
      if (error.value) {
        throw new Error('合并 MR 失败')
      }
    },
    async createTag(project: string, tag: string, ref: string) {
      const { error } = await useHttpGitlab.post(`/api/v4/projects/${encodeURIComponent(project)}/repository/tags`, {
        tag_name: tag,
        ref,
      })
      if (error.value) {
        throw new Error('创建 Tag 失败')
      }
    },
    getDefaultMRTitle(project: Project) {
      return this.setting.mr_title
        .replace('{source}', project.compare_source_branch)
        .replace('{target}', project.compare_target_branch)
    },
  },
})
