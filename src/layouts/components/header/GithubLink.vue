<script setup lang="ts">
import { GITHUB_URL } from '~/constants'

const url = GITHUB_URL
</script>

<template>
  <div
    class="mx-3 text-5 cursor-pointer i-carbon:logo-github s-icon-rotate"
    :title="`go ${url}`"
    @click="tauriOpen(url)"
  />
</template>
