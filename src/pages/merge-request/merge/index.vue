<script lang="ts" setup>
import { usePageStore } from './__store'

const loadingDebounce = useLoadingDebounce()
const store = usePageStore()
const lastRefreshTime = ref('')
const settingVisible = ref(false)

onMounted(() => {
  if (store.setting.mounted_refresh) {
    handleRefresh()
  }
})

const handleRefresh = async () => {
  loadingDebounce.loading.value = true
  try {
    await store.fetchList()
    lastRefreshTime.value = dayjs().format('HH:mm:ss')
  } finally {
    loadingDebounce.loading.value = false
  }
}
const handleMerge = async (row: TypeGitlabMergeRequest) => {
  loadingDebounce.loading.value = true
  try {
    await store.merge(row)
    messageToast.success('合并成功:' + row.title)
    await handleRefresh()
  } catch (e) {
    messageToast.error('合并失败:' + e)
  } finally {
    loadingDebounce.loading.value = false
  }
}
const handleView = (row: TypeGitlabMergeRequest) => {
  tauriOpen(row.web_url + '/diffs')
}
const branchText = (branch: string) => {
  const map = {
    master: 'danger',
    snapshot: 'warning',
    uat: 'primary',
    sit: 'success',
  }
  // @ts-ignore
  return map[branch] ?? 'info'
}
</script>

<template>
  <div>
    <el-table
      v-loading="loadingDebounce.debounced.value"
      :data="store.list"
      :stripe="true"
      :border="true"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }">
      <el-table-column label="标题" min-width="180">
        <template #default="{ row }">
          <el-link :href="row.web_url" type="primary" target="_blank">
            <span>{{ row.title }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="author.name" label="提交者" min-width="130" />
      <el-table-column prop="references.full" label="项目" min-width="170" />
      <el-table-column label="合并" min-width="230">
        <template #default="{ row }">
          <el-text :type="branchText(row.source_branch)">{{ row.source_branch }}</el-text>
          ->
          <el-text :type="branchText(row.target_branch)">{{ row.target_branch }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="170" />
      <el-table-column label="删除源" min-width="70">
        <template #default="{ row }">
          <el-checkbox v-model="row.force_remove_source_branch" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <el-button @click="handleRefresh()">刷新 {{ lastRefreshTime }}</el-button>
            <el-button type="info" @click="settingVisible = true">设置</el-button>
          </el-button-group>
        </template>
        <template #default="{ row }">
          <el-button-group size="small" type="primary">
            <el-button @click="handleView(row)">查看</el-button>
            <el-button :disabled="row.work_in_progress" type="warning" @click="handleMerge(row)">合并</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="settingVisible" title="设置">
      <el-form label-width="120">
        <el-form-item label="评论">
          <el-input v-model="store.setting.note"></el-input>
        </el-form-item>
        <el-form-item label="进入时刷新">
          <el-switch v-model="store.setting.mounted_refresh"></el-switch>
        </el-form-item>
        <el-form-item label="最大拉取量">
          <el-input-number v-model="store.setting.fetch_size" :min="1" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <el-alert title="修改立即生效" :closable="false"></el-alert>
    </el-dialog>
  </div>
</template>