// https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files
module.exports = {
  root: true,
  extends: [
    '@antfu', // https://github.com/antfu/eslint-config
  ],
  rules: {
    // 覆盖 @antfu 中的配置
    'curly': ['error', 'all'], // https://zh-hans.eslint.org/docs/latest/rules/curly
    'no-console': 'error', // https://zh-hans.eslint.org/docs/latest/rules/no-console
  },
}
