<script lang="ts" setup>
const emits = defineEmits(['selected'])
const props = defineProps({
  range: {
    type: Array,
    default: () => dayjsTodayRange(),
  },
})

const range = ref(props.range)
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
    text: '本月',
    value: () => {
      return dayjsThisMonthRange()
    },
  },
]

const handleChange = (value: [Date, Date]) => {
  const [start, end] = value
  emits('selected', [dayjs(start), dayjs(end)])
}
</script>

<template>
  <el-date-picker
    v-model="range"
    type="datetimerange"
    :shortcuts="shortcuts"
    range-separator="To"
    start-placeholder="开始"
    end-placeholder="结束"
    @change="handleChange" />
</template>
