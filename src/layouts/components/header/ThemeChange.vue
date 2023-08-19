<script lang="ts" setup>
const mode = useColorMode()

function toggleMode() {
  mode.value = mode.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div
    class="mx-3 text-5 cursor-pointer s-icon-rotate"
    :class="{
      'i-carbon:sun hover:i-carbon:moon': mode === 'light',
      'i-carbon:moon hover:i-carbon:sun': mode === 'dark',
    }"
    @click="toggleMode()"
  />
</template>
