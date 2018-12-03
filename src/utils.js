const fs = require('fs')
const path = require('path')

/**
 * 异步函数封装
 */
function wrap(func, scope) {
  return function (...args) {
    if (args.length) {
      const temp = args.pop()
      if (typeof temp !== 'function') {
        args.push(temp)
      }
    }

    return new Promise(function (resolve, reject) {
      args.push(function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })

      func.apply((scope || null), args)
    })
  }
}

const readFileSync = wrap(fs.readFile)

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
async function readFile(filePath) {
  try {
    return await readFileSync(filePath, 'utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err)
  }
}

module.exports = {
  readJson,
  readFile,
}
