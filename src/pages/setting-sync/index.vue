<script lang="ts" setup>
import SettingFile from './__components/SettingFile.vue'
import SettingGist from './__components/SettingGist.vue'

useHead({
  title: '配置',
})

const activeTab = ref('file')
</script>

<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane name="file" label="文件">
        <SettingFile />
      </el-tab-pane>
      <el-tab-pane name="github" label="github">
        <SettingGist type="github" />
      </el-tab-pane>
      <el-tab-pane name="gitee" label="gitee">
        <SettingGist type="gitee" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
