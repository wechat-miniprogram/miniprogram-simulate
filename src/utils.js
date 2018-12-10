const fs = require('fs')

/**
 * 读取 json
 */
function readJson(filePath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const content = require(filePath)
    delete require.cache[require.resolve(filePath)]
    return content
  } catch (err) {
    return null
  }
}

/**
 * 读取文件
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    return null
  }
}

/**
 * 转换 rpx 单位为 px 单位
 */
function transformRpx(style) {
  return style.replace(/(\d+)rpx/ig, '$1px')
}

module.exports = {
  readJson,
  readFile,
  transformRpx,
}
