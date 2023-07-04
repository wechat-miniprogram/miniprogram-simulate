const _ = require('./utils')

const systemInfo = {
  brand: 'devtools',
  model: 'iPhone 12/13 Pro Max',
  pixelRatio: 3,
  screenWidth: 428,
  screenHeight: 926,
  windowWidth: 428,
  windowHeight: 835,
  statusBarHeight: 47,
  language: 'zh_CN',
  version: '8.0.5',
  system: 'iOS 10.0.1',
  platform: 'ios',
  fontSizeSetting: 16,
  SDKVersion: '2.32.2',
  benchmarkLevel: 1,
  albumAuthorized: true,
  cameraAuthorized: true,
  locationAuthorized: true,
  microphoneAuthorized: true,
  notificationAuthorized: true,
  notificationAlertAuthorized: true,
  notificationBadgeAuthorized: true,
  notificationSoundAuthorized: true,
  phoneCalendarAuthorized: true,
  bluetoothEnabled: true,
  locationEnabled: true,
  wifiEnabled: true,
  safeArea: {
    left: 0,
    right: 428,
    top: 47,
    bottom: 892,
    width: 428,
    height: 845,
  },
  locationReducedAccuracy: true,
  theme: 'light',
  host: {env: 'WeChat'},
  enableDebug: false,
  deviceOrientation: 'portrait',
}

const skylineInfo = {
  isSupported: false,
  version: '',
  reason: 'client not supported',
}

const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 wechatdevtools/1.06.2306020 MicroMessenger/8.0.5 webview/1 desktopapp miniprogram port/25078 token/52a059808adc79ce2644d3c4d1a24180 runtime/2'

const launchOptions = {
  path: 'pages/index/index',
  scene: 1001,
  query: {},
  shareTicket: '',
  referrerInfo: {},
  forwardMaterials: [],
  chatType: 1,
  apiCategory: 'default',
}

const preDownloadSubpackageTask = {
  onProgressUpdate(listener) {
    setTimeout(() => {
      if (typeof listener === 'function') {
        listener({
          progress: 100,
          totalBytesWritten: 1024,
          totalBytesExpectedToWrite: 1024,
        })
      }
    }, 100)
  },
}

const userCryptoManager = {
  getLatestUserKey: _.mockAsync('getLatestUserKey', {
    encryptKey: '123456789',
    expireTime: 1687853340000,
    iv: '987654321',
    version: 1,
  }),

  getRandomValues(options = {}) {
    let randomValues
    if (options.length) randomValues = new Uint8Array(options.length).buffer

    const {success, fail, complete} = options
    if (!(success || fail || complete)) {
      // 支持 promise
      return new Promise(resolve => {
        options.success = res => resolve(res)

        _.runInAsync(options, {
          errMsg: 'getRandomValues:ok',
          randomValues,
        })
      })
    }

    _.runInAsync(options, {
      errMsg: 'getRandomValues:ok',
      randomValues,
    })
  },
}

const eventChannel = {
  emit() {},
  off() {},
  on() {},
  once() {},
}

const cacheManager = {
  mode: 'weakNetwork',
  origin: '',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  state: 0,

  addRules: () => [],
  addRule: () => '',
  deleteRules() {},
  deleteRule() {},
  clearRules() {},
  on() {},
  off() {},
  start() {},
  stop() {},
  match: () => ({}),
  deleteCaches() {},
  deleteCache() {},
  clearCaches() {},
}

const userInfo = {
  userInfo: {
    nickName: 'june',
    avatarUrl: '',
    gender: 0,
    country: '',
    province: '',
    city: '',
    language: 'zh_CN',
  },
  rawData: '',
  signature: '',
  encryptedDat: '',
  iv: '',
  cloudID: '',
}

const setting = {
  authSetting: {
    userInfo: true,
    userLocation: true,
    address: true,
    invoiceTitle: true,
    invoice: true,
    werun: true,
    record: true,
    writePhotosAlbum: true,
    camera: true,
    bluetooth: true,
    addPhoneContact: true,
    addPhoneCalendar: true,
  },
  subscriptionsSetting: {
    mainSwitch: false,
    itemSettings: {},
  },
  miniprogramAuthSetting: undefined,
}

const stats = {
  mode: '',
  size: 1024,
  lastAccessedTime: 1688030468,
  lastModifiedTime: 1688030469,
  isDirectory: () => false,
  isFile: () => true,
}

const ad = {
  load: Promise.resolve({}),
  show: Promise.resolve({}),
  destroy() {},
  onLoad() {},
  offLoad() {},
  onError() {},
  offError() {},
  onClose() {},
  offClose() {},
}

const audioBuffer = {
  sampleRate: 0,
  length: 0,
  duration: 0,
  numberOfChannels: 0,
  copyFromChannel() {},
  copyToChannel() {},
  getChannelData: _.mockSync(Float32Array.from([])),
}

module.exports = {
  systemInfo,
  skylineInfo,
  userAgent,
  launchOptions,
  preDownloadSubpackageTask,
  userCryptoManager,
  eventChannel,
  cacheManager,
  userInfo,
  setting,
  stats,
  ad,
  audioBuffer,
}
