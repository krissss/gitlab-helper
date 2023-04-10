<script lang="ts" setup>
const route = useRoute()
// ssr 模式下会闪烁
const isDark = useDark()

const activeMenu = computed(() => {
  return route.path
})

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
        <!--        <div class="menu-btn">
          <el-button @click="pluginStorage.importConfig()"> 导入数据 </el-button>
        </div>
        <div class="menu-btn">
          <el-button @click="pluginStorage.exportConfig()"> 导出数据 </el-button>
        </div>-->
        <div class="menu-btn">
          <el-switch v-model="isDark" inline-prompt :active-icon="ElIconMoon" :inactive-icon="ElIconSunny" />

          <el-avatar :size="50" :src="storeUser.avatar_url" />
          <span>{{ storeUser.name }}</span>
        </div>
      </el-menu>
    </el-header>
    <el-main class="content">
      <slot />
    </el-main>
  </el-container>
</template>

<style scoped>
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
</style>
