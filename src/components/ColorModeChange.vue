<script lang="ts" setup>
const mode = useColorMode({
  emitAuto: true,
})
const modeList = [
  { mode: 'dark', icon: ElIconMoon, title: '深色' },
  { mode: 'light', icon: ElIconSunny, title: '浅色' },
  { mode: 'auto', icon: ElIconMonitor, title: '自动' },
]
const currentMode = computed(() => {
  return modeList.find(item => item.mode === mode.value)
})
const { state, next } = useCycleList(
  modeList.map(item => item.mode),
  { initialValue: mode },
)
watchEffect(() => {
  mode.value = state.value as any
})
</script>

<template>
  <el-button :icon="currentMode.icon" circle @click="next()" />
</template>
