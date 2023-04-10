// https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files
module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript', // https://github.com/nuxt/eslint-config/blob/main/packages/eslint-config-legacy-typescript/index.js
    'prettier', // 放在最后，https://github.com/prettier/eslint-config-prettier
  ],
}
