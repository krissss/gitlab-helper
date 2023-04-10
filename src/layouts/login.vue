<script lang="ts" setup></script>

<template>
  <div>
    <el-container>
      <el-main class="content">
        <slot />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.content {
  max-width: 500px;
  margin: 20px auto;
}
</style>
