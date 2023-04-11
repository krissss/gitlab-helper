<template>
  <el-container>
    <el-header>
      <LayoutHeader />
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
</style>
