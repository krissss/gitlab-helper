// https://stylelint.io/user-guide/configure
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  ignoreFiles: ['src-tauri/**'],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  },
}
