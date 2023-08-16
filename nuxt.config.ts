// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import type { NuxtPage } from '@nuxt/schema'
import packageJson from './package.json'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  srcDir: 'src',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      version: packageJson.version,
    },
  },
  ssr: false,
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
    'pages:extend': function (pages: NuxtPage[]) {
      // remove routes
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (pattern.test(page.path)) {
            pagesToRemove.push(page)
          }
          else {
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
    '@element-plus/nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-lodash',
    '@unocss/nuxt',
    // dev 环境下有点问题，暂时不用
    isDev ? '' : 'nuxt-vercel-analytics',
    '@nuxtjs/i18n',
    'dayjs-nuxt',
  ].filter(item => item),
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
  },
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']],
  },
  lodash: {
    prefix: '__',
    prefixSkip: false,
    upperAfterPrefix: false,
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'zh', file: 'zh.yaml', name: '中文' },
      { code: 'en', file: 'en.yaml', name: 'English' },
    ],
    lazy: true,
    langDir: './locales',
    defaultLocale: 'zh',
  },
  // 开发配置
  $development: {
    devServer: {
      port: 1455,
    },
    typescript: {
      strict: true,
      shim: false,
    },
    devtools: {
      enabled: true,
    },
  },
})
