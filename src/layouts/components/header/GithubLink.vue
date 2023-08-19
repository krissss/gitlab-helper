<script setup lang="ts">
const url = 'https://github.com/krissss/gitlab-helper'
</script>

<template>
  <div
    class="mx-3 text-5 cursor-pointer i-carbon:logo-github s-icon-rotate"
    :title="`go ${url}`"
    @click="tauriOpen(url)"
  />
</template>
