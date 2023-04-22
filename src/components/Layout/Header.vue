<script lang="ts" setup>
import type { ElDropdown } from '#components'

const activeMenu = computed(() => {
  return useRoute().path
})

const storeUser = useStoreUser()

const dropdownRef = ref<InstanceType<typeof ElDropdown> | null>(null)

const isInApp = tauriIsIn()
const appVersion = ref('')
onMounted(async () => {
  if (isInApp) {
    const version = (await tauriVersion()) || ''
    if (version) {
      appVersion.value = 'v' + version
    }
  }
})
</script>

<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" :router="true" class="!px-5">
    <div class="flex items-center" @click="navigateTo('/')">
      <img src="~/assets/images/logo.png" alt="" class="w-50px h-50px" />
    </div>
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/merge-request/merge">合并MR</el-menu-item>
    <el-menu-item index="/merge-request/check">检查MR</el-menu-item>
    <el-menu-item index="/release">发版</el-menu-item>
    <div class="flex-grow"></div>
    <div class="menu-items">
      <ColorModeChange />

      <el-dropdown v-if="storeUser.isLogin" ref="dropdownRef" trigger="click">
        <el-avatar
          v-if="storeUser.isLogin"
          :size="50"
          :src="storeUser.avatar_url"
          class="!w-32px !h-32px ml-5"
          :title="storeUser.name" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="useIStorageSetting.import()">导入配置</el-dropdown-item>
            <el-dropdown-item @click="useIStorageSetting.export()">导出配置</el-dropdown-item>
            <el-dropdown-item v-if="isInApp" @click="tauriCheckUpdater()">检查更新 {{ appVersion }}</el-dropdown-item>
            <el-dropdown-item divided></el-dropdown-item>
            <el-dropdown-item @click="storeUser.logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-if="!storeUser.isLogin" class="menu-items">
        <el-button @click="useIStorageSetting.import()">导入配置</el-button>
        <el-button type="primary" link @click="navigateTo('/login')">登录</el-button>
      </div>
    </div>
  </el-menu>
</template>

<style scoped lang="scss">
.menu-items {
  @apply flex items-center ml-5;
}
</style>
