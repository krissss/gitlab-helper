<script lang="ts" setup>
import type { ElDropdown } from '#components'

const activeMenu = computed(() => {
  return useRoute().path
})

const storeUser = useStoreUser()

const dropdownRef = ref<InstanceType<typeof ElDropdown> | null>(null)
</script>

<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" :router="true">
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/merge-request/merge">合并MR</el-menu-item>
    <el-menu-item index="/merge-request/check">检查MR</el-menu-item>
    <el-menu-item index="/release">发版</el-menu-item>
    <div class="flex-grow"></div>
    <div v-if="!storeUser.isLogin" class="menu-btn">
      <el-button @click="useIStorageSetting.import()">导入配置</el-button>
    </div>
    <div class="menu-btn">
      <ColorModeChange />

      <el-dropdown v-if="storeUser.isLogin" ref="dropdownRef" trigger="click" style="margin-right: 30px">
        <el-avatar
          v-if="storeUser.isLogin"
          :size="50"
          :src="storeUser.avatar_url"
          class="user-avatar"
          :title="storeUser.name" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="useIStorageSetting.import()">导入配置</el-dropdown-item>
            <el-dropdown-item @click="useIStorageSetting.export()">导出配置</el-dropdown-item>
            <el-dropdown-item divided></el-dropdown-item>
            <el-dropdown-item @click="storeUser.logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<style scoped lang="scss">
.flex-grow {
  flex-grow: 1;
}

.menu-btn {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  margin: 0 5px 0 20px;
}
</style>
