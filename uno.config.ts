// https://unocss.dev/guide/config-file
import { defineConfig, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
