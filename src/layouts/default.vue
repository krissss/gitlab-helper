<template>
  <el-container class="min-h-screen">
    <el-header>
      <LayoutHeader />
    </el-header>
    <el-main>
      <slot />
    </el-main>
    <el-footer>
      <LayoutFooter />
    </el-footer>
  </el-container>
</template>
