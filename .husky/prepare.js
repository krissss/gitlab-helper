const isCi = process.env.CI !== undefined
if (!isCi) {
  try {
    require('husky').install(__dirname)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
    // 忽略 .husky 未安装
  }
}
