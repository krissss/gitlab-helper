// https://unocss.dev/guide/config-file
import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
