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

module.exports = {
  readJson,
  readFile,
}
