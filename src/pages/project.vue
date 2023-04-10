<script lang="ts" setup>
const storeProject = useStoreProject()
await storeProject.fetchList()
</script>

<template>
  <div>
    <div v-for="(item, index) in storeProject.list" :key="index">
      {{ item.path_with_namespace }}
    </div>
  </div>
</template>
