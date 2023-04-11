// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devServer: {
    port: 1455,
  },
  ssr: false,
  typescript: {
    strict: true,
  },
  imports: {
    dirs: ['composables/*/index.ts'],
  },
  modules: [
    // https://nuxt.com.cn/modules/devtools
    '@nuxt/devtools',
    // https://nuxt.com.cn/modules/element-plus
    '@element-plus/nuxt',
    // https://nuxt.com.cn/modules/vueuse
    '@vueuse/nuxt',
    // https://nuxt.com.cn/modules/pinia
    '@pinia/nuxt',
    // https://nuxt.com.cn/modules/color-mode
    '@nuxtjs/color-mode',
    // https://nuxt.com.cn/modules/lodash
    'nuxt-lodash',
  ],
  devtools: {
    enabled: false,
  },
  elementPlus: {
    themes: ['dark'],
  },
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']],
  },
  colorMode: {
    classSuffix: '', // 配合 elementPlus 不加后缀
  },
  lodash: {
    prefix: '_',
    prefixSkip: false,
  },
})
