<script setup lang="ts">
const storeUser = useStoreUser()

if (storeUser.setting.autoUpdate && !sessionStorage.getItem('isAppStarted')) {
  // 仅自动检查更新一次
  sessionStorage.setItem('isAppStarted', 'true')
  tauriCheckUpdater()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
