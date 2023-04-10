// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  nitro: {
    storage: {
      db: {
        // driver: 'redis',
        driver: 'fs',
        base: './.data/db',
      },
    },
    devStorage: {
      db: {
        driver: 'fs',
        base: './.data/db',
      },
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
    [
      '@pinia/nuxt',
      {
        autoImports: [['defineStore', 'definePiniaStore']],
      },
    ],
  ],
  elementPlus: {
    themes: ['dark'],
  },
})
