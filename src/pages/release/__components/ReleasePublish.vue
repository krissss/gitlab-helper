<script lang="ts" setup>
import type { Project, ReleasePublishStepInfo, ReleaseType, StepType } from '../__types'
import { releaseTypeOptions } from '../__types'
import { usePageStore } from '../__store'

const stepInfosMr: ReleasePublishStepInfo = {
  createMR: { title: '创建 MR', status: 'wait' },
  addComment: { title: '添加 MR comment', status: 'wait' },
  merge: { title: '合并 MR', status: 'wait' },
}
const stepInfosTag: ReleasePublishStepInfo = {
  createTag: { title: '创建 tag', status: 'wait' },
}

const visible = ref(false)
const visibleStep = ref(false)
const form = reactive({
  project: '',
  mr_disable: false,
  mr_source: '',
  mr_target: '',
  mr_comment: '',
  mr_title: '',
  mr_description: '',
  mr_assignee_id: undefined as number | undefined,
  mr_assignee_username: undefined as string | undefined,
  tag_from: '',
  tag_name: '',
  tag_last: '',
  tag_disable: false,
  tag_type: '' as ReleaseType | '',
})
const steps = reactive({
  infos: {} as ReleasePublishStepInfo,
  active: 0,
})
const store = usePageStore()

watchEffect(() => {
  if (form.mr_disable && form.tag_disable) {
    steps.infos = {}
    return
  }
  if (form.mr_disable) {
    steps.infos = { ...stepInfosTag }
    return
  }
  if (form.tag_disable) {
    steps.infos = { ...stepInfosMr }
    return
  }
  steps.infos = { ...stepInfosMr, ...stepInfosTag }
})
watch(
  () => form.tag_type,
  (val) => {
    if (val) {
      form.tag_name = semverInc(form.tag_last, val)
    }
  },
)

async function doStep(step: StepType, doFn: () => Promise<void>) {
  steps.active++

  const currentStep = steps.infos[step]
  if (!currentStep) {
    throw new Error(`未知的 step:${step}`)
  }
  currentStep.status = 'process'

  try {
    await doFn()
  }
  catch (e) {
    currentStep.status = 'error'
    throw e
  }

  currentStep.status = 'success'
}

async function startRelease() {
  visible.value = false
  visibleStep.value = true
  // 保持所有步骤初始为 wait
  Object.keys(steps.infos).forEach((step) => {
    steps.infos[step as StepType]!.status = 'wait'
  })

  try {
    steps.active = 0
    if (!form.mr_disable) {
      let mrId = 0
      await doStep('createMR', async () => {
        mrId = await store.createMergeRequest(form.project, form.mr_source, form.mr_target, form.mr_title, {
          description: form.mr_description,
          assignee_id: form.mr_assignee_id,
        })
      })
      await promiseSleep(500)
      await doStep('addComment', async () => {
        await store.addComment(form.project, mrId, form.mr_comment)
      })
      await promiseSleep(1500)
      await doStep('merge', async () => {
        await store.mergeRequest(form.project, mrId)
      })
      await promiseSleep(500)
    }

    if (!form.tag_disable) {
      await doStep('createTag', async () => {
        await store.createTag(form.project, form.tag_name, form.tag_from)
      })
    }
  }
  catch (e) {
    messageToast.error(e as string)
  }
}

defineExpose({
  show: (model: Project) => {
    form.project = model.project
    form.mr_source = model.compare_source_branch
    form.mr_target = model.compare_target_branch
    form.tag_from = model.compare_target_branch
    form.tag_last = `${model.last_tag}`
    form.mr_title = store.getDefaultMRTitle(model)
    form.tag_name = ''
    form.tag_type = ''
    form.mr_comment = store.setting.mr_note

    const storeUser = useStoreUser()
    form.mr_assignee_id = storeUser.id
    form.mr_assignee_username = storeUser.name

    form.mr_disable = store.setting.mr_disable
    form.tag_disable = store.setting.tag_disable
    form.mr_description = ''

    visible.value = true

    nextTick(() => {
      form.tag_type = 'patch'
    })
  },
})
</script>

<template>
  <ClientOnly>
    <el-dialog v-model="visible" title="发布版本">
      <el-form :model="form" label-width="120">
        <el-divider content-position="left">
          Merge Request
        </el-divider>
        <el-form-item label="禁用 MR">
          <el-switch v-model="form.mr_disable" />
        </el-form-item>
        <template v-if="!form.mr_disable">
          <el-form-item label="源">
            <el-input v-model="form.mr_source" disabled />
          </el-form-item>
          <el-form-item label="目标">
            <el-input v-model="form.mr_target" disabled />
          </el-form-item>
          <el-form-item label="Title" required>
            <el-input v-model="form.mr_title" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.mr_description" />
          </el-form-item>
          <el-form-item label="Assignee">
            <el-input v-model="form.mr_assignee_username" disabled />
          </el-form-item>
          <el-form-item label="Comment" required>
            <el-input v-model="form.mr_comment" />
          </el-form-item>
        </template>

        <el-divider content-position="left">
          Tag
        </el-divider>
        <el-form-item label="禁用 Tag">
          <el-switch v-model="form.tag_disable" />
        </el-form-item>
        <template v-if="!form.tag_disable">
          <el-form-item label="Create from">
            <el-input v-model="form.tag_from" disabled />
          </el-form-item>
          <el-form-item label="最新分支">
            <el-input v-model="form.tag_last" disabled />
          </el-form-item>
          <el-form-item label="发布分支" required>
            <el-input v-model="form.tag_name">
              <template #append>
                <el-select v-model="form.tag_type">
                  <el-option
                    v-for="(item, index) in releaseTypeOptions"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="startRelease()">发布</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="visibleStep" title="发布过程">
      <el-steps :active="steps.active">
        <template v-for="(info, index) in steps.infos" :key="index">
          <el-step v-if="info" :title="info.title" :status="info.status" />
        </template>
      </el-steps>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visibleStep = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </ClientOnly>
</template>
