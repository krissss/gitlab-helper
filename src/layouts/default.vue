<script lang="ts" setup>
import { useIStorageSetting } from '~/composables/iStorage'

const route = useRoute()
const colorMode = useColorMode()

const activeMenu = computed(() => {
  return route.path
})
const changeColor = (val: boolean) => {
  colorMode.preference = val ? 'dark' : 'light'
}

const storeUser = useStoreUser()
</script>

<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" :router="true">
        <el-menu-item index="/project"> 项目 </el-menu-item>
        <el-menu-item index="/setting"> 设置 </el-menu-item>
        <el-menu-item index="release"> 发布 </el-menu-item>
        <el-menu-item index="/merge-request/check"> 检查MR </el-menu-item>
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

          <el-avatar :size="50" :src="storeUser.avatar_url" class="user-avatar" :title="storeUser.name" />
        </div>
      </el-menu>
    </el-header>
    <el-main class="content">
      <slot />
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.content {
  padding: 20px 40px;
}

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
