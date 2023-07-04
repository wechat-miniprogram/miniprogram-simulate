/**
 * 异步方法通用部分
 */
function runInAsync(options, res) {
  setTimeout(() => {
    if (res.errMsg.indexOf(':ok') >= 0 && typeof options.success === 'function') options.success(res)
    if (res.errMsg.indexOf(':fail') >= 0 && typeof options.fail === 'function') options.fail(res)
    if (typeof options.complete === 'function') options.complete(res)
  }, 0)
}

/**
 * 计算字符串字节数
 */
function getSize(string) {
  let total = 0
  for (let i = 0, len = string.length; i < len; i++) {
    const charCode = string.charCodeAt(i)
    if (charCode <= 0x007f) {
      total += 1
    } else if (charCode <= 0x07ff) {
      total += 2
    } else if (charCode <= 0xffff) {
      total += 3
    } else {
      total += 4
    }
  }

  return total
}

/**
 * 快速模拟同步接口
 */
function mockSync(ret) {
  return () => ret
}

/**
 * 快速模拟异步接口
 */
function mockAsync(name, data = {}) {
  return (options = {}) => {
    runInAsync(options, {
      errMsg: `${name}:ok`,
      errCode: 0,
      errno: 0,
      ...data,
    })
  }
}

/**
 * 快速模拟支持 promise 的异步接口
 */
function mockAsyncAndPromise(name, data = {}, promiseData) {
  return (options = {}) => {
    const {success, fail, complete} = options
    if (!(success || fail || complete)) {
      // 支持 promise
      return new Promise((resolve, reject) => {
        options.success = res => resolve(promiseData || res)
        options.fail = err => reject(err)

        runInAsync(options, {
          errMsg: `${name}:ok`,
          errCode: 0,
          errno: 0,
          ...data,
        })
      })
    }

    runInAsync(options, {
      errMsg: `${name}:ok`,
      errCode: 0,
      errno: 0,
      ...data,
    })
  }
}

module.exports = {
  runInAsync,
  getSize,
  mockSync,
  mockAsync,
  mockAsyncAndPromise,
}
