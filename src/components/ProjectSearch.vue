<script lang="ts" setup>
import type { InputInstance, TableInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    selected: number[]
  }>(),
  {
    selected: () => [],
  },
)
const emit = defineEmits(['selected'])

const visible = ref(false)
const search = ref('')
const searchResult = ref<TypeGitlab.Project[]>([])
const tableRef = ref<TableInstance>()
const loadingDebounce = useLoadingDebounce()
const storeGitlab = useStoreGitlab()
const inputRef = ref<InputInstance>()

onStartTyping(() => {
  if (inputRef.value) {
    inputRef.value!.focus()
  }
})

const handleSearch = __debounce(async () => {
  loadingDebounce.loading.value = true

  try {
    searchResult.value = []
    const { data } = await useHttpGitlab.get<TypeGitlab.Project[]>('/api/v4/projects', {
      search: search.value,
      simple: true,
    })
    if (data.value) {
      searchResult.value = data.value
    }
  }
  finally {
    loadingDebounce.loading.value = false
  }
}, 500)
function handleConfirm() {
  const rows: TypeGitlab.Project[] = tableRef.value?.getSelectionRows()
  emit('selected', rows)
  visible.value = false
}
function handleRowClick(row: TypeGitlab.Project) {
  if (!selectable(row)) {
    return
  }
  tableRef.value?.toggleRowSelection(row)
}
function selectable(row: TypeGitlab.Project) {
  return props.selected.findIndex(id => id === row.id) === -1
}

watchDebounced(search, () => handleSearch(), { debounce: 500 })
</script>

<template>
  <el-button @click="visible = true">
    添加
  </el-button>
  <ClientOnly>
    <el-dialog v-model="visible" title="搜索添加项目" append-to-body>
      <div>
        <el-input ref="inputRef" v-model="search" placeholder="项目名" clearable />
      </div>
      <el-table
        ref="tableRef"
        v-loading="loadingDebounce.debounced.value"
        :data="searchResult"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column property="id" label="ID" min-width="50" />
        <el-table-column label="项目">
          <template #default="{ row }">
            <el-link :href="storeGitlab.getProjectLink(row.path_with_namespace)" type="primary" target="_blank">
              {{ row.path_with_namespace }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-button v-if="searchResult.length > 0" type="primary" @click="handleConfirm()">
        确认
      </el-button>
    </el-dialog>
  </ClientOnly>
</template>
