const _ = require('./utils')

module.exports = {
  getSystemInfo(options = {}) {
    const res = Object.assign({}, wx.getSystemInfoSync())
    res.errMsg = 'getSystemInfo:ok'

    _.runInAsync(options, res)
  },
  getSystemInfoSync() {
    return {
      SDKVersion: '2.3.0',
      batteryLevel: 100,
      benchmarkLevel: 1,
      brand: 'devtools',
      fontSizeSetting: 16,
      language: 'zh_CN',
      model: 'iPhone 7 Plus',
      pixelRatio: 3,
      platform: 'devtools',
      screenHeight: 736,
      screenWidth: 414,
      statusBarHeight: 20,
      system: 'iOS 10.0.1',
      version: '6.6.3',
      windowHeight: 672,
      windowWidth: 414,
    }
  },
}
