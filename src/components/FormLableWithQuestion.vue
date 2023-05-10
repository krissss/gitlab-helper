<script lang="ts" setup>
const props = withDefaults(defineProps<{
  label: string
  tooltip: string
  tooltipHtml?: boolean
}>(), {
  tooltipHtml: false,
})
</script>

<template>
  <span class="flex items-center">
    {{ props.label }}&nbsp;
    <el-tooltip :content="props.tooltip" :raw-content="props.tooltipHtml" placement="top">
      <el-icon :size="12">
        <ElIconQuestionFilled />
      </el-icon>
    </el-tooltip>
  </span>
</template>
