<script lang="ts" setup>
const emits = defineEmits(['selected'])

const visible = ref(false)
const search = ref('')
const searchResult = ref<Array<TypeGitlabProject>>([])
const tableRef = ref<InstanceType<typeof ElTable>>()

const handleSearch = async () => {
  searchResult.value = []
  const { data } = await useHttpGitlab.get<Array<TypeGitlabProject>>('/api/v4/projects', {
    search: search.value,
    simple: true,
  })
  if (data.value) {
    searchResult.value = data.value
  }
}
const handleConfirm = () => {
  const rows: Array<TypeGitlabProject> = tableRef.value.getSelectionRows()
  emits('selected', rows)
  visible.value = false
}
</script>

<template>
  <span>
    <el-button @click="visible = true">添加项目</el-button>
    <el-dialog v-model="visible" title="搜索添加项目">
      <div>
        <el-input v-model="search" placeholder="项目名" clearable @change="handleSearch" />
      </div>
      <div v-if="searchResult.length > 0">
        <el-table ref="tableRef" :data="searchResult">
          <el-table-column type="selection" width="55" />
          <el-table-column property="id" label="ID" min-width="50" />
          <el-table-column property="path_with_namespace" label="Name" />
        </el-table>

        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>
  </span>
</template>
