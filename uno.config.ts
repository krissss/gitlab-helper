// https://unocss.dev/guide/config-file
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify({
      strict: true,
      prefix: 'un-',
      prefixedOnly: true,
    }),
  ],
  shortcuts: {
    's-icon-rotate': 'transform transition-800 hover:rotate-y-180',
  },
})
