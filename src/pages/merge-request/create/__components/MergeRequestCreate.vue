<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { Assignee, Project, ProjectOperateKey } from '../__types'
import { usePageStore } from '../__store'

let project: Project

const visible = ref(false)
const form = reactive({
  project: '',
  source: '',
  targets: [] as string[],
  assignee_id: 0,
  title: '',
  description: '',
  delete_source_branch: false,
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  source: [{ required: true, trigger: 'blur' }],
  targets: [{ required: true, trigger: 'blur' }],
  assignee_id: [{ required: true, trigger: 'blur' }],
  title: [{ required: true, trigger: 'blur' }],
})
const store = usePageStore()
const sourceBranches = ref([] as string[])
const targetBranches = ref([] as string[])
const assigneeList = ref([] as Assignee[])

function projectOperationSave(max: number, operate: ProjectOperateKey, ...values: any[]) {
  values.forEach((item) => {
    project[operate] = arrayUnshiftKeepLength(project[operate], item, max)
  })
  store.update(project)
}

watchEffect(() => {
  if (form.source) {
    form.title = __upperFirst(form.source.replace(/_-/g, ' '))
    projectOperationSave(10, 'last_branch_sources', form.source)
  }
  if (form.targets && form.targets.length > 0) {
    projectOperationSave(10, 'last_branch_targets', ...form.targets)
  }
  if (form.assignee_id) {
    const assignee = assigneeList.value.find(item => item.id === form.assignee_id)
    if (assignee) {
      projectOperationSave(10, 'last_assignee_list', assignee)
    }
  }
})

async function searchSourceBranch(search: string) {
  if (!search) {
    sourceBranches.value = project.last_branch_sources
    return
  }
  sourceBranches.value = await store.searchBranch(form.project, search)
}
async function searchTargetBranch(search: string) {
  if (!search) {
    targetBranches.value = project.last_branch_targets
    return
  }
  targetBranches.value = await store.searchBranch(form.project, search)
}
async function searchAssigneeList(search: string) {
  if (!search) {
    assigneeList.value = project.last_assignee_list
    return
  }
  assigneeList.value = await store.searchAssigneeList(form.project, search)
}

async function startCreate() {
  loading.show()
  let hasError = false
  const lastMrCreated = [] as number[]
  for (const target of form.targets) {
    const mergeRequest = await store.createMergeRequest(
      form.project,
      form.source,
      target,
      form.assignee_id,
      form.title,
      form.description,
      form.delete_source_branch,
    )
    if (!mergeRequest) {
      messageToast.error(`创建失败: ${form.source} -> ${target}`)
      hasError = true
      continue
    }
    messageToast.success(`创建成功: ${form.source} -> ${target}， iid: ${mergeRequest.iid}`)
    lastMrCreated.push(mergeRequest.iid)
  }
  projectOperationSave(5, 'last_mr_created', ...lastMrCreated)
  loading.hide()
  if (!hasError) {
    visible.value = false
  }
}

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid) => {
    if (valid) {
      await startCreate()
    }
  })
}

defineExpose({
  show: (model: Project) => {
    project = model

    form.project = model.project
    form.source = ''
    form.targets = model.last_branch_targets.length > 0 ? [model.last_branch_targets[0]] : []
    form.assignee_id = model.last_assignee_list.length > 0 ? model.last_assignee_list[0].id : 0
    form.title = ''
    form.description = ''
    form.delete_source_branch = false

    sourceBranches.value = project.last_branch_sources
    targetBranches.value = project.last_branch_targets
    assigneeList.value = project.last_assignee_list

    visible.value = true
  },
})
</script>

<template>
  <ClientOnly>
    <el-dialog v-model="visible" title="创建 MergeRequest">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="120">
        <el-form-item label="项目">
          <el-input v-model="form.project" disabled />
        </el-form-item>
        <el-form-item label="源" prop="source">
          <el-select v-model="form.source" clearable filterable remote :remote-method="searchSourceBranch" default-first-option style="width: 100%">
            <el-option v-for="item in sourceBranches" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标" prop="targets">
          <el-select v-model="form.targets" clearable filterable multiple remote :reserve-keyword="false" :remote-method="searchTargetBranch" default-first-option style="width: 100%">
            <el-option v-for="item in targetBranches" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Assignee" prop="assignee_id">
          <el-select v-model="form.assignee_id" clearable filterable remote :remote-method="searchAssigneeList" default-first-option style="width: 100%" @change="(value: number) => (form.assignee_id = value)">
            <el-option v-for="item in assigneeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="删除源" prop="delete_source_branch">
          <el-switch v-model="form.delete_source_branch" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </ClientOnly>
</template>
