<script lang="ts" setup>
import { SlickItem, SlickList } from 'vue-slicksort'

const props = defineProps<{
  modelValue: Array<{ id: number; project: string }>
}>()
const emit = defineEmits(['update:modelValue'])
const list = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="sort-append-container" />
  <SlickList v-model:list="list" axis="y" class="list" append-to=".sort-append-container" helper-class="dragging">
    <SlickItem v-for="(item, index) in list" :key="item.id" :index="index" class="item">
      <el-tag>{{ item.project }}({{ item.id }})</el-tag>
    </SlickItem>
  </SlickList>
</template>

<style lang="scss">
.list {
  cursor: grab;

  .item {
    margin: 2px 0;
  }
}
</style>
