<script lang="ts" setup>
import { usePageStore } from './__store'

const store = usePageStore()
const errorProjects = reactive<{ [key: number]: { check: number; ok: number } }>({})
const checkRange = ref(dayjsThisWeekRange())
const loading = ref(false)

const handleAdd = (data: Array<TypeGitlabProject>) => {
  store.add(data)
}
const handleDateSet = (value: [Dayjs, Dayjs]) => {
  checkRange.value = value
}
const handleCheck = async (project: TypeGitlabProject) => {
  errorProjects[project.id] = { check: 0, ok: 0 }
  let nextLink = `/api/v4/projects/${project.id}/merge_requests`
  let first = true
  do {
    let options = {}
    if (first) {
      options = {
        query: {
          state: 'merged',
          created_after: checkRange.value[0].toISOString(),
          created_before: checkRange.value[1].toISOString(),
        },
      }
    }
    const { _data: list, headers } = await useHttpGitlab.fetchRaw<TypeGitlabMergeRequest[]>(nextLink, options)
    if (list) {
      list.forEach(item => {
        errorProjects[project.id].check += 1
        if (item.user_notes_count >= 1) {
          errorProjects[project.id].ok += 1
        }
      })
    }
    nextLink = gitlabLinkParser(headers.get('link') ?? '').getNext()
    first = false
  } while (nextLink)
}
const handleCheckAll = () => {
  store.list.forEach(item => handleCheck(item))
}
const checkButtonType = (project: TypeGitlabProject) => {
  if (!errorProjects[project.id] || errorProjects[project.id].check === 0) {
    return 'primary'
  }
  if (errorProjects[project.id].check > errorProjects[project.id].ok) {
    return 'warning'
  }
  return 'success'
}
</script>

<template>
  <div>
    <ProjectSearch @selected="handleAdd" />
    <DatePicker :range="checkRange" @selected="handleDateSet" />
    <el-table
      v-loading="loading"
      :data="store.list"
      :stripe="true"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="path_with_namespace" label="项目" />
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <el-button @click="handleCheckAll">检查所有</el-button>
          </el-button-group>
        </template>
        <template #default="scope">
          <el-button-group size="small" type="primary">
            <el-button :type="checkButtonType(scope.row)" @click="handleCheck(scope.row)">
              检查 &nbsp;
              <span v-if="errorProjects[scope.row.id]">
                {{ errorProjects[scope.row.id].ok + '/' + errorProjects[scope.row.id].check }}
              </span>
            </el-button>
            <el-button type="danger" @click="store.remove(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
