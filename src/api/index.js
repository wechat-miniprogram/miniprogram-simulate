const Animation = require('./animation')

const noop = (options = {}) => {
  const res = {
    errMsg: 'mockApi:ok',
  }

  setTimeout(() => {
    if (typeof options.success === 'function') options.success(res)
    if (typeof options.complete === 'function') options.complete(res)
  }, 0)
}

module.exports = {
  request: noop,

  uploadFile: noop,
  downloadFile: noop,

  connectSocket: noop,
  onSocketOpen: noop,
  onSocketError: noop,
  sendSocketMessage: noop,
  onSocketMessage: noop,
  closeSocket: noop,
  onSocketClose: noop,

  chooseImage: noop,
  previewImage: noop,
  getImageInfo: noop,
  saveImageToPhotosAlbum: noop,

  startRecord: noop,
  stopRecord: noop,

  getRecorderManager: noop,

  playVoice: noop,
  pauseVoice: noop,
  stopVoice: noop,

  getBackgroundAudioPlayerState: noop,
  playBackgroundAudio: noop,
  pauseBackgroundAudio: noop,
  seekBackgroundAudio: noop,
  stopBackgroundAudio: noop,
  onBackgroundAudioPlay: noop,
  onBackgroundAudioPause: noop,
  onBackgroundAudioStop: noop,

  getBackgroundAudioManager: noop,

  createAudioContext: noop,
  createInnerAudioContext: noop,
  getAvailableAudioSources: noop,

  chooseVideo: noop,
  saveVideoToPhotosAlbum: noop,

  createVideoContext: noop,

  createCameraContext: noop,

  createLivePlayerContext: noop,
  createLivePusherContext: noop,

  loadFontFace: noop,

  saveFile: noop,
  getFileInfo: noop,
  getSavedFileList: noop,
  getSavedFileInfo: noop,
  removeSavedFile: noop,
  openDocument: noop,

  setStorage: noop,
  setStorageSync: noop,
  getStorage: noop,
  getStorageSync: noop,
  getStorageInfo: noop,
  getStorageInfoSync: noop,
  removeStorage: noop,
  removeStorageSync: noop,
  clearStorage: noop,
  clearStorageSync: noop,

  getLocation: noop,
  chooseLocation: noop,

  openLocation: noop,

  createMapContext: noop,

  getSystemInfo(options = {}) {
    const res = Object.assign({}, wx.getSystemInfoSync())
    res.errMsg = 'getSystemInfo:ok'

    setTimeout(() => {
      if (typeof options.success === 'function') options.success(res)
      if (typeof options.complete === 'function') options.complete(res)
    }, 0)
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
  canIUse: noop,

  onMemoryWarning: noop,

  getNetworkType: noop,
  onNetworkStatusChange: noop,

  onAccelerometerChange: noop,
  startAccelerometer: noop,
  stopAccelerometer: noop,

  onCompassChange: noop,
  startCompass: noop,
  stopCompass: noop,

  makePhoneCall: noop,

  scanCode: noop,

  setClipboardData: noop,
  getClipboardData: noop,

  openBluetoothAdapter: noop,
  closeBluetoothAdapter: noop,
  getBluetoothAdapterState: noop,
  onBluetoothAdapterStateChange: noop,
  startBluetoothDevicesDiscovery: noop,
  stopBluetoothDevicesDiscovery: noop,
  getBluetoothDevices: noop,
  getConnectedBluetoothDevices: noop,
  onBluetoothDeviceFound: noop,
  createBLEConnection: noop,
  closeBLEConnection: noop,
  getBLEDeviceServices: noop,
  getBLEDeviceCharacteristics: noop,
  readBLECharacteristicValue: noop,
  writeBLECharacteristicValue: noop,
  notifyBLECharacteristicValueChange: noop,
  onBLEConnectionStateChange: noop,
  onBLECharacteristicValueChange: noop,

  startBeaconDiscovery: noop,
  stopBeaconDiscovery: noop,
  getBeacons: noop,
  onBeaconUpdate: noop,
  onBeaconServiceChange: noop,

  setScreenBrightness: noop,
  getScreenBrightness: noop,
  setKeepScreenOn: noop,

  onUserCaptureScreen: noop,

  vibrateLong: noop,
  vibrateShort: noop,

  addPhoneContact: noop,

  getHCEState: noop,
  startHCE: noop,
  stopHCE: noop,
  onHCEMessage: noop,
  sendHCEMessage: noop,

  startWifi: noop,
  stopWifi: noop,
  connectWifi: noop,
  getWifiList: noop,
  onGetWifiList: noop,
  setWifiList: noop,
  onWifiConnected: noop,
  getConnectedWifi: noop,

  showToast: noop,
  showLoading: noop,
  hideToast: noop,
  hideLoading: noop,
  showModal: noop,
  showActionSheet: noop,

  setNavigationBarTitle: noop,
  showNavigationBarLoading: noop,
  hideNavigationBarLoading: noop,
  setNavigationBarColor: noop,

  setTabBarBadge: noop,
  removeTabBarBadge: noop,
  showTabBarRedDot: noop,
  hideTabBarRedDot: noop,
  setTabBarStyle: noop,
  setTabBarItem: noop,
  showTabBar: noop,
  hideTabBar: noop,

  setBackgroundColor: noop,
  setBackgroundTextStyle: noop,

  setTopBarText: noop,

  navigateTo: noop,
  redirectTo: noop,
  switchTab: noop,
  navigateBack: noop,
  reLaunch: noop,

  createAnimation(transition = {}) {
    return new Animation(transition)
  },

  pageScrollTo: noop,

  createCanvasContext: noop,
  createContext: noop,
  drawCanvas: noop,
  canvasToTempFilePath: noop,
  canvasGetImageData: noop,
  canvasPutImageData: noop,

  startPullDownRefresh: noop,
  stopPullDownRefresh: noop,

  createSelectorQuery: noop,

  createIntersectionObserver: noop,

  getExtConfig: noop,
  getExtConfigSync: noop,

  login: noop,
  checkSession: noop,

  authorize: noop,

  getUserInfo: noop,

  requestPayment: noop,

  showShareMenu: noop,
  hideShareMenu: noop,
  updateShareMenu: noop,
  getShareInfo: noop,

  chooseAddress: noop,

  addCard: noop,
  openCard: noop,

  openSetting: noop,
  getSetting: noop,

  getWeRunData: noop,

  getAccountInfoSync: noop,

  navigateToMiniProgram: noop,
  navigateBackMiniProgram: noop,

  chooseInvoiceTitle: noop,

  checkIsSupportSoterAuthentication: noop,
  startSoterAuthentication: noop,
  checkIsSoterEnrolledInDevice: noop,

  getUpdateManager: noop,

  createWorker: noop,

  getLogManager: noop,

  reportMonitor: noop,

  setEnableDebug: noop,
}
