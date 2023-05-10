<script lang="ts" setup>
const mode = useColorMode()
</script>

<template>
  <el-switch
    v-model="mode"
    inline-prompt
    :active-icon="ElIconMoon"
    :inactive-icon="ElIconSunny"
    active-value="dark"
    inactive-value="light"
  />
</template>
