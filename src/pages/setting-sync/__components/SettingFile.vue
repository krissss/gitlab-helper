<script lang="ts" setup>
function handleExport() {
  const link = document.createElement('a')
  link.download = `gitlab-helper-config-${dayjs().format('YYYYMMDDHHmm')}.json`
  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(useIStorageSetting.getAllData())}`
  link.click()
}
function handleImport() {
  const input: HTMLInputElement = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = (event: any) => {
    const files = event.target.files
    if (!files || !files.length) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event: any) => {
      useIStorageSetting.setAllData(event.target.result)
    }
    reader.readAsText(files[0])
  }

  input.click()
}

function handleClean() {
  messageConfirmCB('确定清空？同时将退出登录', () => {
    useIStorageSetting.cleanAll()
  })
}
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="handleImport()">
        配置导入
      </el-button>
      <el-button v-if="useStoreUser().isLogin" type="primary" @click="handleExport()">
        配置导出
      </el-button>
    </div>

    <div class="mt-4">
      <el-button v-if="useStoreUser().isLogin" type="danger" @click="handleClean()">
        清空本地所有配置
      </el-button>
    </div>
  </div>
</template>
