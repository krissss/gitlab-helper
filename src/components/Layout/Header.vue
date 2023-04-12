<script lang="ts" setup>
const colorMode = useColorMode()

const activeMenu = computed(() => {
  return useRoute().path
})
const changeColor = (val: boolean) => {
  colorMode.preference = val ? 'dark' : 'light'
}

const storeUser = useStoreUser()
</script>

<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" :router="true">
    <el-menu-item index="/"> 首页 </el-menu-item>
    <el-menu-item index="/merge-request/check"> 检查MR </el-menu-item>
    <el-menu-item index="/release"> 发布 </el-menu-item>
    <div class="flex-grow"></div>
    <div class="menu-btn">
      <el-button @click="useIStorageSetting.import()"> 导入数据 </el-button>
    </div>
    <div class="menu-btn">
      <el-button @click="useIStorageSetting.export()"> 导出数据 </el-button>
    </div>
    <div class="menu-btn">
      <el-switch
        inline-prompt
        :active-icon="ElIconMoon"
        :value="colorMode.value === 'dark'"
        :inactive-icon="ElIconSunny"
        @change="changeColor" />

      <el-avatar
        v-if="storeUser.isLogin"
        :size="50"
        :src="storeUser.avatar_url"
        class="user-avatar"
        :title="storeUser.name" />
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
