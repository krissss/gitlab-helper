<script setup lang="ts">
import { usePageStore } from './__store'
import type { Project } from './__types'
import ReleasePublish from './__components/ReleasePublish.vue'
import ProjectSort from '~/components/ProjectSort.vue'

useHead({
  title: '发版',
})

const store = usePageStore()
const loadingDebounce = useLoadingDebounce()
const storeGitlab = useStoreGitlab()
const releasePublishRef = ref<InstanceType<typeof ReleasePublish> | null>(null)
const editInput = ref('')
const editInputRef = ref(null)
const settingVisible = ref(false)

onClickOutside(editInputRef, () => {
  editInput.value = ''
})

async function handleRefresh(row: Project | null) {
  loadingDebounce.loading.value = true
  try {
    if (row) {
      await store.refresh(row)
    }
    else {
      await store.refreshAll()
    }
  }
  finally {
    loadingDebounce.loading.value = false
  }
}

async function handleRelease(row: Project) {
  // 刷新一次信息，保证数据是最新的
  await handleRefresh(row)
  releasePublishRef.value?.show(row)
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
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column label="项目" min-width="180">
        <template #default="{ row }">
          <el-link :href="storeGitlab.getProjectLink(row.project)" type="primary" target="_blank">
            {{ row.project }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="最新tag" min-width="250">
        <template #default="{ row }">
          <el-link :href="storeGitlab.getTagLink(row.project)" type="primary" target="_blank">
            {{ row.last_tag }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="分支比较">
        <el-table-column label="源" min-width="100">
          <template #default="{ row, $index }">
            <el-input v-if="`source_${$index}` === editInput" ref="editInputRef" v-model="row.compare_source_branch" />
            <span v-else class="editable" @click="editInput = `source_${$index}`">{{ row.compare_source_branch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标" min-width="100">
          <template #default="{ row, $index }">
            <el-input v-if="`target_${$index}` === editInput" ref="editInputRef" v-model="row.compare_target_branch" />
            <span v-else class="editable" @click="editInput = `target_${$index}`">{{ row.compare_target_branch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="差异数" width="70">
          <template #default="{ row }">
            <el-link
              :href="storeGitlab.getCompareLink(row.project, row.compare_source_branch, row.compare_target_branch)"
              type="primary"
              target="_blank"
            >
              {{ row.compare_commit_diff_count }}
            </el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" min-width="170" />
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <ProjectSearch :selected="store.ids" @selected="store.add" />
            <el-button @click="handleRefresh(null)">
              刷新所有
            </el-button>
            <el-button type="info" @click="settingVisible = true">
              设置
            </el-button>
          </el-button-group>
        </template>
        <template #default="{ row }">
          <el-button-group size="small" type="primary">
            <el-button type="danger" @click="messageConfirmCB(`确定删除 ${row.project}`, () => store.remove(row))">
              删除
            </el-button>
          </el-button-group>
          <br>
          <el-button-group size="small" type="primary">
            <el-button @click="handleRefresh(row)">
              刷新
            </el-button>
            <el-button type="warning" @click="handleRelease(row)">
              发布版本
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <ReleasePublish ref="releasePublishRef" />

    <el-dialog v-model="settingVisible" title="设置">
      <el-form label-width="120">
        <el-form-item label="合并时标题">
          <el-input v-model="store.setting.mr_title" />
        </el-form-item>
        <el-form-item label="合并时评论">
          <el-input v-model="store.setting.mr_note" />
        </el-form-item>
        <el-form-item label="默认禁用 MR">
          <el-switch v-model="store.setting.mr_disable" />
        </el-form-item>
        <el-form-item label="默认禁用 Tag">
          <el-switch v-model="store.setting.tag_disable" />
        </el-form-item>
        <el-form-item label="项目排序">
          <ProjectSort v-model="store.list" />
        </el-form-item>
      </el-form>
      <el-alert title="修改立即生效" :closable="false" />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.editable {
  cursor: pointer;
  border-bottom: 1px dashed var(--el-color-primary);
}
</style>
