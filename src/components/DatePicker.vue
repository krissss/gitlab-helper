<script lang="ts" setup>
const props = defineProps<{
  modelValue: [Date, Date] | [string, string]
}>()
const emit = defineEmits(['update:modelValue'])
const range = useVModel(props, 'modelValue', emit)

const shortcuts = [
  {
    text: '今天',
    value: () => {
      return dayjsTodayRange()
    },
  },
  {
    text: '昨天',
    value: () => {
      return dayjsYesterdayRange()
    },
  },
  {
    text: '昨天到今天',
    value: () => {
      return dayjsYesterdayToTodayRange()
    },
  },
  {
    text: '本周',
    value: () => {
      return dayjsThisWeekRange()
    },
  },
  {
    text: '上周',
    value: () => {
      return dayjsLastWeekRange()
    },
  },
  {
    text: '本月',
    value: () => {
      return dayjsThisMonthRange()
    },
  },
]
</script>

<template>
  <el-date-picker
    v-model="range"
    type="datetimerange"
    :shortcuts="shortcuts"
    range-separator="To"
    start-placeholder="开始"
    end-placeholder="结束"
  />
</template>
