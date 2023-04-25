<script lang="ts" setup>
import { ElDropdown } from '#components'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(item => {
    let code: string = item
    if (typeof item !== 'string') {
      code = item.code
    }
    return code !== locale.value
  })
})
</script>

<template>
  <el-dropdown>
    <span>
      <i class="iconfont icon-language-sharp text-5"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in availableLocales" :key="item.code" @click.prevent.stop="setLocale(item.code)">
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
