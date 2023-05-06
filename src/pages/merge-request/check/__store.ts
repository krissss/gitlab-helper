import type { CheckInfo, Project } from './__types'

export const usePageStore = definePiniaStore(pageStoreKey(), {
  state: () => {
    return {
      list: useIStorage<Project[]>('pageMergeRequestCheck', []),
      checkInfos: {} as Record<number, CheckInfo>,
      setting: useIStorage('pageMergeRequestCheckSetting', {
        check_range: dayjsToDate(dayjsThisWeekRange()) as [Date, Date] | [string, string],
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
          updated_at: '',
          error_iids: [],
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
    async check(project: Project) {
      this.checkInfos[project.id] = { check: 0, errors: [] }
      let nextLink = `/api/v4/projects/${project.id}/merge_requests`
      let first = true
      const [checkStart, checkEnd] = dayjsToDateIsoString(this.setting.check_range)
      project.last_check_range = [checkStart, checkEnd]
      do {
        let options = {}
        if (first) {
          options = {
            query: {
              state: 'merged',
              created_after: project.last_check_range[0],
              created_before: project.last_check_range[1],
            },
          }
        }
        const { _data: list, headers } = await useHttpGitlab.fetchRaw<TypeGitlab.MergeRequest[]>(nextLink, options)
        if (list) {
          list.forEach((item) => {
            this.checkInfos[project.id].check += 1
            if (item.user_notes_count < 1) {
              this.checkInfos[project.id].errors.push(item.iid)
            }
          })
        }
        nextLink = gitlabLinkParser(headers.get('link') ?? '').getNext()
        first = false
      } while (nextLink)

      project.updated_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
      project.error_iids = this.checkInfos[project.id].errors

      this.update(project)
    },
    async checkAll() {
      const tasks = []
      for (const project of this.list) {
        tasks.push(this.check(project))
      }
      await Promise.all(tasks)
    },
  },
})
