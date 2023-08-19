<script setup lang="ts">
const { url } = storeToRefs(useStoreGitlab())
</script>

<template>
  <div
    v-if="url"
    class="mx-3 text-5 cursor-pointer i-mdi:gitlab s-icon-rotate"
    :title="`go ${url}`"
    @click="tauriOpen(url)"
  />
</template>
