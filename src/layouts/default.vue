<script lang="ts" setup>
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import AppHeader from './components/AppHeader.vue'

const { locale } = useI18n()

const localeData = computed(() => (locale.value === 'en' ? en : zh))
</script>

<template>
  <el-config-provider :locale="localeData">
    <el-container class="min-h-screen">
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-config-provider>
</template>
