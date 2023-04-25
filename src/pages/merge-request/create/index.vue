<script lang="ts" setup>
import type { Project } from './__types'
import { usePageStore } from './__store'
import MergeRequestCreate from './__components/MergeRequestCreate.vue'

useHead({
  title: '创建MR',
})

const store = usePageStore()
const loadingDebounce = useLoadingDebounce()
const storeGitlab = useStoreGitlab()
const settingVisible = ref(false)
const mergeRequestCreateRef = ref<InstanceType<typeof MergeRequestCreate> | null>(null)

const handleCreateMR = (row: Project) => {
  mergeRequestCreateRef.value?.show(row)
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
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column label="项目" min-width="180">
        <template #default="{ row }">
          <el-link :href="storeGitlab.getProjectLink(row.project)" type="primary" target="_blank">
            {{ row.project }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="最近MR" min-width="180">
        <template #default="{ row }">
          <template v-for="iid in row.last_mr_created" :key="iid">
            <el-link :href="storeGitlab.getMergeRequestLink(row.project, iid)" type="primary" target="_blank">
              {{ iid }};
            </el-link>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <ProjectSearch @selected="store.add" />
            <el-button type="info" @click="settingVisible = true">设置</el-button>
          </el-button-group>
        </template>
        <template #default="{ row }">
          <el-button-group size="small" type="primary">
            <el-button @click="handleCreateMR(row)">创建MR</el-button>
            <el-button type="danger" @click="messageConfirmCB(`确定删除 ${row.project}`, () => store.remove(row))">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <MergeRequestCreate ref="mergeRequestCreateRef" />

    <el-dialog v-model="settingVisible" title="设置">
      <el-form label-width="120">
        <el-form-item label="项目排序">
          <ProjectSort v-model="store.list" />
        </el-form-item>
      </el-form>
      <el-alert title="修改立即生效" :closable="false"></el-alert>
    </el-dialog>
  </div>
</template>
