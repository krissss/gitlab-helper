<script lang="ts" setup>
import type { ElTable, ElInput } from '#components'

const emit = defineEmits(['selected'])
defineExpose({
  show: () => {
    dialogVisible.value = true
  },
})

const dialogVisible = ref(false)
const search = ref('')
const searchResult = ref<TypeGitlabProject[]>([])
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)
const loading = ref(false)
const storeGitlab = useStoreGitlab()
const inputRef = ref<InstanceType<typeof ElInput> | null>(null)

watchDebounced(search, () => handleSearch(), { debounce: 500 })

onStartTyping(() => {
  if (inputRef.value) {
    inputRef.value!.focus()
  }
})

const handleSearch = __debounce(async () => {
  loading.value = true

  try {
    searchResult.value = []
    const { data } = await useHttpGitlab.get<Array<TypeGitlabProject>>('/api/v4/projects', {
      search: search.value,
      simple: true,
    })
    if (data.value) {
      searchResult.value = data.value
    }
  } finally {
    loading.value = false
  }
}, 500)
const handleConfirm = () => {
  const rows: TypeGitlabProject[] = tableRef.value?.getSelectionRows()
  emit('selected', rows)
  dialogVisible.value = false
}
</script>

<template>
  <ClientOnly>
    <el-dialog v-model="dialogVisible" title="搜索添加项目">
      <div>
        <el-input ref="inputRef" v-model="search" placeholder="项目名" clearable />
      </div>
      <el-table ref="tableRef" v-loading="loading" :data="searchResult">
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" label="ID" min-width="50" />
        <el-table-column label="项目">
          <template #default="{ row }">
            <el-link :href="storeGitlab.getProjectLink(row.path_with_namespace)" type="primary" target="_blank">
              {{ row.path_with_namespace }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-button v-if="searchResult.length > 0" type="primary" @click="handleConfirm()">确认</el-button>
    </el-dialog>
  </ClientOnly>
</template>
