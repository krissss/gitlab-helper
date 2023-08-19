<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter((item) => {
    let code: string = item
    if (typeof item !== 'string') {
      code = item.code
    }
    return code !== locale.value
  })
})
</script>

<template>
  <el-dropdown class="mx-3">
    <div class="i-carbon:ibm-watson-language-translator text-5 s-icon-rotate" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in availableLocales" :key="item.code" @click.prevent.stop="setLocale(item.code)">
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
