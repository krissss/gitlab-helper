// https://nuxt.com/docs/api/configuration/nuxt-config
import { NuxtPage } from '@nuxt/schema'

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
    dirs: ['composables/**/*.ts'],
  },
  hooks: {
    'pages:extend'(pages: NuxtPage[]) {
      // remove routes
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (pattern.test(page.path)) {
            pagesToRemove.push(page)
          } else {
            removePagesMatching(pattern, page.children)
          }
        }
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1)
        }
      }
      // 包含 /__ 移除
      removePagesMatching(/\/__/, pages)
    },
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
    // https://nuxt.com.cn/modules/lodash
    'nuxt-lodash',
  ],
  devtools: {
    enabled: true,
  },
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
  },
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']],
  },
  colorMode: {
    classSuffix: '', // 配合 elementPlus 不加后缀
  },
  lodash: {
    prefix: '__',
    prefixSkip: false,
    upperAfterPrefix: false,
  },
})
