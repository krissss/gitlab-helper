<script setup lang="ts">
import { usePageStore } from './__store'
import type { Project } from './__types'
import ReleasePublish from './__components/ReleasePublish.vue'
import { ProjectSearch } from '#components'
import { messageConfirmCB } from '~/utils/message'

const store = usePageStore()
const loading = ref(false)
const storeGitlab = useStoreGitlab()
const projectSearchRef = ref<InstanceType<typeof ProjectSearch> | null>(null)
const releasePublishRef = ref<InstanceType<typeof ReleasePublish> | null>(null)
const editInput = ref('')
const editInputRef = ref(null)
onClickOutside(editInputRef, () => {
  editInput.value = ''
})

const handleRefresh = async (row: Project | null) => {
  loading.value = true
  try {
    if (row) {
      await store.refresh(row)
    } else {
      await store.refreshAll()
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  projectSearchRef.value?.show()
}

const handleRelease = async (row: Project) => {
  // 刷新一次信息，保证数据是最新的
  await handleRefresh(row)
  releasePublishRef.value?.show(row)
}
</script>

<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="store.list"
      :stripe="true"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }">
      <el-table-column prop="id" label="ID" width="50" />
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
            <el-input v-if="'source_' + $index === editInput" ref="editInputRef" v-model="row.compare_source_branch" />
            <span v-else @click="editInput = 'source_' + $index">{{ row.compare_source_branch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标" min-width="100">
          <template #default="{ row, $index }">
            <el-input v-if="'target_' + $index === editInput" ref="editInputRef" v-model="row.compare_target_branch" />
            <span v-else @click="editInput = 'target_' + $index">{{ row.compare_target_branch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="差异数" width="70">
          <template #default="{ row }">
            <el-link
              :href="storeGitlab.getCompareLink(row.project, row.compare_source_branch, row.compare_target_branch)"
              type="primary"
              target="_blank">
              {{ row.compare_commit_diff_count }}
            </el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" min-width="170" />
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <el-button @click="handleAdd()">添加</el-button>
            <el-button @click="handleRefresh(null)">刷新所有</el-button>
          </el-button-group>
        </template>
        <template #default="{ row }">
          <el-button-group size="small" type="primary">
            <el-button type="danger" @click="messageConfirmCB(`确定删除 ${row.project}`, () => store.remove(row))">
              删除
            </el-button>
          </el-button-group>
          <br />
          <el-button-group size="small" type="primary">
            <el-button @click="handleRefresh(row)">刷新</el-button>
            <el-button type="warning" @click="handleRelease(row)">发布版本</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <ReleasePublish ref="releasePublishRef" />
    <ProjectSearch ref="projectSearchRef" @selected="store.add" />
  </div>
</template>
