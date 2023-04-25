<script lang="ts" setup>
import type { Project, Assignee } from '../__types'
import { usePageStore } from '../__store'

const project = ref<Project>()

defineExpose({
  show: (model: Project) => {
    project.value = model

    form.project = model.project
    form.source = ''
    form.targets = model.last_branch_targets.length > 0 ? [model.last_branch_targets[0]] : []
    form.assignee = model.last_assignee_list.length > 0 ? model.last_assignee_list[0] : { id: 0, name: '' }
    form.title = ''
    form.description = ''
    form.delete_source_branch = false

    sourceBranches.value = project.value.last_branch_sources
    targetBranches.value = project.value.last_branch_targets
    assigneeList.value = project.value.last_assignee_list

    visible.value = true
  },
})

const visible = ref(false)
const form = reactive({
  project: '',
  source: '',
  targets: [] as string[],
  assignee: { id: 0, name: '' } as Assignee,
  title: '',
  description: '',
  delete_source_branch: false,
})
const store = usePageStore()
const sourceBranches = ref([] as string[])
const targetBranches = ref([] as string[])
const assigneeList = ref([] as Assignee[])

watchEffect(() => {
  if (project.value) {
    if (form.source) {
      arrayUnshiftKeepLength(project.value.last_branch_sources, form.source, 10)
    }
    if (form.targets && form.targets.length > 0) {
      form.targets.forEach(item => {
        arrayUnshiftKeepLength(project.value!.last_branch_targets, item, 10)
      })
    }
    if (form.assignee.id) {
      arrayUnshiftKeepLength(project.value.last_assignee_list, form.assignee, 10)
    }
  }

  if (form.source) {
    form.title = __upperFirst(form.source.replace(/_-/g, ' '))
  }
})

const searchSourceBranch = async (search: string) => {
  if (!search) {
    sourceBranches.value = project.value!.last_branch_sources
    return
  }
  sourceBranches.value = await store.searchBranch(form.project, search)
}
const searchTargetBranch = async (search: string) => {
  if (!search) {
    targetBranches.value = project.value!.last_branch_targets
    return
  }
  targetBranches.value = await store.searchBranch(form.project, search)
}
const searchAssigneeList = async (search: string) => {
  if (!search) {
    assigneeList.value = project.value!.last_assignee_list
    return
  }
  assigneeList.value = await store.searchAssigneeList(form.project, search)
}

const startCreate = async () => {
  loading.show()
  let hasError = false
  const lastMrCreated = [] as number[]
  for (const target of form.targets) {
    const mergeRequest = await store.createMergeRequest(
      form.project,
      form.source,
      target,
      form.assignee.id,
      form.title,
      form.description,
      form.delete_source_branch
    )
    if (!mergeRequest) {
      messageToast.error(`创建失败: ${form.source} -> ${target}`)
      hasError = true
      continue
    }
    messageToast.success(`创建成功: ${form.source} -> ${target}， iid: ${mergeRequest.iid}`)
    lastMrCreated.push(mergeRequest.iid)
  }
  lastMrCreated.forEach(iid => arrayUnshiftKeepLength(project.value!.last_mr_created, iid, 5))
  loading.hide()
  if (!hasError) {
    visible.value = false
  }
}
</script>

<template>
  <ClientOnly>
    <el-dialog v-model="visible" title="创建 MergeRequest">
      <el-form :model="form" label-width="120">
        <el-form-item label="源" required>
          <el-select
            v-model="form.source"
            clearable
            filterable
            remote
            :remote-method="searchSourceBranch"
            style="width: 100%">
            <el-option v-for="item in sourceBranches" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标" required>
          <el-select
            v-model="form.targets"
            clearable
            filterable
            multiple
            remote
            :reserve-keyword="false"
            :remote-method="searchTargetBranch"
            style="width: 100%">
            <el-option v-for="item in targetBranches" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Assignee" required>
          <el-select
            v-model="form.assignee"
            clearable
            filterable
            remote
            :remote-method="searchAssigneeList"
            style="width: 100%"
            @change="(value: Assignee) => (form.assignee = value)">
            <el-option v-for="item in assigneeList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Title" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="删除源">
          <el-switch v-model="form.delete_source_branch" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="startCreate()">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </ClientOnly>
</template>
