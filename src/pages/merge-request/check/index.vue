<script lang="ts" setup>
import type { Project } from './__types'
import { usePageStore } from './__store'
import ProjectSort from '~/components/ProjectSort.vue'

const store = usePageStore()
const loadingDebounce = useLoadingDebounce()
const storeGitlab = useStoreGitlab()
const settingVisible = ref(false)

const handleCheck = async (project: Project | null) => {
  loadingDebounce.loading.value = true
  try {
    if (project) {
      await store.check(project)
    } else {
      await store.checkAll()
    }
  } finally {
    loadingDebounce.loading.value = false
  }
}
const checkButtonType = (project: Project) => {
  if (!store.checkInfos[project.id]) {
    return 'primary'
  }
  const { errors } = store.checkInfos[project.id]
  if (errors.length > 0) {
    return 'warning'
  }
  return 'success'
}
const checkButtonShow = (project: Project) => {
  if (!store.checkInfos[project.id]) {
    return ''
  }
  const { check, errors } = store.checkInfos[project.id]
  return `${check - errors.length}/${check}`
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
      <el-table-column label="最新检查区间" min-width="290">
        <template #default="{ row }">
          <span>{{ row.last_check_range ? row.last_check_range[0] + ' - ' + row.last_check_range[1] : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常MR" min-width="80">
        <template #default="{ row }">
          <template v-if="row.error_iids.length > 0">
            <el-link
              v-for="iid in row.error_iids"
              :key="iid"
              :href="storeGitlab.getMergeRequestLink(row.project, iid)"
              type="primary"
              target="_blank">
              {{ iid }};
            </el-link>
          </template>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" min-width="170" />
      <el-table-column label="操作" fixed="right" min-width="170">
        <template #header>
          <el-button-group size="small" type="primary">
            <ProjectSearch @selected="store.add" />
            <el-button @click="handleCheck(null)">检查所有</el-button>
            <el-button type="info" @click="settingVisible = true">设置</el-button>
          </el-button-group>
        </template>
        <template #default="{ row }">
          <el-button-group size="small" type="primary">
            <el-button :type="checkButtonType(row)" @click="handleCheck(row)">
              检查 {{ checkButtonShow(row) }}
            </el-button>
            <el-button type="danger" @click="messageConfirmCB(`确定删除 ${row.project}`, () => store.remove(row))">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="settingVisible" title="设置">
      <el-form label-width="120">
        <el-form-item label="检查范围">
          <DatePicker v-model="store.setting.check_range" />
        </el-form-item>
        <el-form-item label="项目排序">
          <ProjectSort v-model="store.list" />
        </el-form-item>
      </el-form>
      <el-alert title="修改立即生效" :closable="false"></el-alert>
    </el-dialog>
  </div>
</template>
