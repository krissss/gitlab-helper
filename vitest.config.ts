import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    cache: {
      dir: '../.nuxt/vitest_cache', // 相对 nuxt.config.ts 中的 srcDir
    },
  },
})
