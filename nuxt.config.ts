// https://nuxt.com/docs/api/configuration/nuxt-config
import { NuxtPage } from '@nuxt/schema'
import packageJson from './package.json'

export default defineNuxtConfig({
  srcDir: 'src',
  devServer: {
    port: 1455,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      version: packageJson.version,
    },
  },
  ssr: false,
  typescript: {
    strict: true,
  },
  css: ['@/assets/scss/index.scss'],
  imports: {
    dirs: ['composables/**/*.ts'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/element/index.scss" as element;
            @use "@/assets/scss/var.scss" as *;
          `,
        },
      },
    },
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
    // https://unocss.dev/integrations/nuxt
    '@unocss/nuxt',
    // https://github.com/xanderbarkhatov/nuxt-vercel-analytics
    'nuxt-vercel-analytics',
    // https://v8.i18n.nuxtjs.org/getting-started/basic-usage
    '@nuxtjs/i18n',
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
  i18n: {
    locales: [
      { code: 'zh', file: 'zh.yaml', name: '中文' },
      { code: 'en', file: 'en.yaml', name: 'English' },
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    lazy: true,
    langDir: './locales',
    vueI18n: './i18n.config.ts',
  },
})
