const Animation = require('./animation')
const dataApi = require('./data')
const _ = require('./utils')

const mockSync = (ret) => () => ret
const mockAsync = (name) => (options = {}) => {
  const res = {
    errMsg: `${name}:ok`,
  }
  _.runInAsync(options, res)
}

module.exports = {
  request: mockAsync('request'),

  uploadFile: mockAsync('uploadFile'),
  downloadFile: mockAsync('downloadFile'),

  connectSocket: mockAsync('connectSocket'),
  onSocketOpen: mockAsync('onSocketOpen'),
  onSocketError: mockAsync('onSocketError'),
  sendSocketMessage: mockAsync('sendSocketMessage'),
  onSocketMessage: mockAsync('onSocketMessage'),
  closeSocket: mockAsync('closeSocket'),
  onSocketClose: mockAsync('onSocketClose'),

  chooseImage: mockAsync('chooseImage'),
  previewImage: mockAsync('previewImage'),
  getImageInfo: mockAsync('getImageInfo'),
  saveImageToPhotosAlbum: mockAsync('saveImageToPhotosAlbum'),

  startRecord: mockAsync('startRecord'),
  stopRecord: mockAsync('stopRecord'),

  getRecorderManager: mockAsync('getRecorderManager'),

  playVoice: mockAsync('playVoice'),
  pauseVoice: mockAsync('pauseVoice'),
  stopVoice: mockAsync('stopVoice'),

  getBackgroundAudioPlayerState: mockAsync('getBackgroundAudioPlayerState'),
  playBackgroundAudio: mockAsync('playBackgroundAudio'),
  pauseBackgroundAudio: mockAsync('pauseBackgroundAudio'),
  seekBackgroundAudio: mockAsync('seekBackgroundAudio'),
  stopBackgroundAudio: mockAsync('stopBackgroundAudio'),
  onBackgroundAudioPlay: mockAsync('onBackgroundAudioPlay'),
  onBackgroundAudioPause: mockAsync('onBackgroundAudioPause'),
  onBackgroundAudioStop: mockAsync('onBackgroundAudioStop'),

  getBackgroundAudioManager: mockAsync('getBackgroundAudioManager'),

  createAudioContext: mockAsync('createAudioContext'),
  createInnerAudioContext: mockAsync('createInnerAudioContext'),
  getAvailableAudioSources: mockAsync('getAvailableAudioSources'),

  chooseVideo: mockAsync('chooseVideo'),
  saveVideoToPhotosAlbum: mockAsync('saveVideoToPhotosAlbum'),

  createVideoContext: mockAsync('createVideoContext'),

  createCameraContext: mockAsync('createCameraContext'),

  createLivePlayerContext: mockAsync('createLivePlayerContext'),
  createLivePusherContext: mockAsync('createLivePusherContext'),

  loadFontFace: mockAsync('loadFontFace'),

  saveFile: mockAsync('saveFile'),
  getFileInfo: mockAsync('getFileInfo'),
  getSavedFileList: mockAsync('getSavedFileList'),
  getSavedFileInfo: mockAsync('getSavedFileInfo'),
  removeSavedFile: mockAsync('removeSavedFile'),
  openDocument: mockAsync('openDocument'),

  createMapContext: mockAsync('createMapContext'),

  onMemoryWarning: mockAsync('onMemoryWarning'),

  getNetworkType: mockAsync('getNetworkType'),
  onNetworkStatusChange: mockAsync('onNetworkStatusChange'),

  onAccelerometerChange: mockAsync('onAccelerometerChange'),
  startAccelerometer: mockAsync('startAccelerometer'),
  stopAccelerometer: mockAsync('stopAccelerometer'),

  onCompassChange: mockAsync('onCompassChange'),
  startCompass: mockAsync('startCompass'),
  stopCompass: mockAsync('stopCompass'),

  makePhoneCall: mockAsync('makePhoneCall'),

  scanCode: mockAsync('scanCode'),

  setClipboardData: mockAsync('setClipboardData'),
  getClipboardData: mockAsync('getClipboardData'),

  openBluetoothAdapter: mockAsync('openBluetoothAdapter'),
  closeBluetoothAdapter: mockAsync('closeBluetoothAdapter'),
  getBluetoothAdapterState: mockAsync('getBluetoothAdapterState'),
  onBluetoothAdapterStateChange: mockAsync('onBluetoothAdapterStateChange'),
  startBluetoothDevicesDiscovery: mockAsync('startBluetoothDevicesDiscovery'),
  stopBluetoothDevicesDiscovery: mockAsync('stopBluetoothDevicesDiscovery'),
  getBluetoothDevices: mockAsync('getBluetoothDevices'),
  getConnectedBluetoothDevices: mockAsync('getConnectedBluetoothDevices'),
  onBluetoothDeviceFound: mockAsync('onBluetoothDeviceFound'),
  createBLEConnection: mockAsync('createBLEConnection'),
  closeBLEConnection: mockAsync('closeBLEConnection'),
  getBLEDeviceServices: mockAsync('getBLEDeviceServices'),
  getBLEDeviceCharacteristics: mockAsync('getBLEDeviceCharacteristics'),
  readBLECharacteristicValue: mockAsync('readBLECharacteristicValue'),
  writeBLECharacteristicValue: mockAsync('writeBLECharacteristicValue'),
  notifyBLECharacteristicValueChange: mockAsync('notifyBLECharacteristicValueChange'),
  onBLEConnectionStateChange: mockAsync('onBLEConnectionStateChange'),
  onBLECharacteristicValueChange: mockAsync('onBLECharacteristicValueChange'),

  startBeaconDiscovery: mockAsync('startBeaconDiscovery'),
  stopBeaconDiscovery: mockAsync('stopBeaconDiscovery'),
  getBeacons: mockAsync('getBeacons'),
  onBeaconUpdate: mockAsync('onBeaconUpdate'),
  onBeaconServiceChange: mockAsync('onBeaconServiceChange'),

  setScreenBrightness: mockAsync('setScreenBrightness'),
  getScreenBrightness: mockAsync('getScreenBrightness'),
  setKeepScreenOn: mockAsync('setKeepScreenOn'),

  onUserCaptureScreen: mockAsync('onUserCaptureScreen'),

  vibrateLong: mockAsync('vibrateLong'),
  vibrateShort: mockAsync('vibrateShort'),

  addPhoneContact: mockAsync('addPhoneContact'),

  getHCEState: mockAsync('getHCEState'),
  startHCE: mockAsync('startHCE'),
  stopHCE: mockAsync('stopHCE'),
  onHCEMessage: mockAsync('onHCEMessage'),
  sendHCEMessage: mockAsync('sendHCEMessage'),

  startWifi: mockAsync('startWifi'),
  stopWifi: mockAsync('stopWifi'),
  connectWifi: mockAsync('connectWifi'),
  getWifiList: mockAsync('getWifiList'),
  onGetWifiList: mockAsync('onGetWifiList'),
  setWifiList: mockAsync('setWifiList'),
  onWifiConnected: mockAsync('onWifiConnected'),
  getConnectedWifi: mockAsync('getConnectedWifi'),

  showToast: mockAsync('showToast'),
  showLoading: mockAsync('showLoading'),
  hideToast: mockAsync('hideToast'),
  hideLoading: mockAsync('hideLoading'),
  showModal: mockAsync('showModal'),
  showActionSheet: mockAsync('showActionSheet'),

  setNavigationBarTitle: mockAsync('setNavigationBarTitle'),
  showNavigationBarLoading: mockAsync('showNavigationBarLoading'),
  hideNavigationBarLoading: mockAsync('hideNavigationBarLoading'),
  setNavigationBarColor: mockAsync('setNavigationBarColor'),

  setTabBarBadge: mockAsync('setTabBarBadge'),
  removeTabBarBadge: mockAsync('removeTabBarBadge'),
  showTabBarRedDot: mockAsync('showTabBarRedDot'),
  hideTabBarRedDot: mockAsync('hideTabBarRedDot'),
  setTabBarStyle: mockAsync('setTabBarStyle'),
  setTabBarItem: mockAsync('setTabBarItem'),
  showTabBar: mockAsync('showTabBar'),
  hideTabBar: mockAsync('hideTabBar'),

  setBackgroundColor: mockAsync('setBackgroundColor'),
  setBackgroundTextStyle: mockAsync('setBackgroundTextStyle'),

  setTopBarText: mockAsync('setTopBarText'),

  createAnimation(transition = {}) {
    return new Animation(transition)
  },

  pageScrollTo: mockAsync('pageScrollTo'),

  createCanvasContext: mockAsync('createCanvasContext'),
  createContext: mockAsync('createContext'),
  drawCanvas: mockAsync('drawCanvas'),
  canvasToTempFilePath: mockAsync('canvasToTempFilePath'),
  canvasGetImageData: mockAsync('canvasGetImageData'),
  canvasPutImageData: mockAsync('canvasPutImageData'),

  startPullDownRefresh: mockAsync('startPullDownRefresh'),
  stopPullDownRefresh: mockAsync('stopPullDownRefresh'),

  createSelectorQuery: mockAsync('createSelectorQuery'),

  createIntersectionObserver: mockAsync('createIntersectionObserver'),

  login: mockAsync('login'),
  checkSession: mockAsync('checkSession'),

  authorize: mockAsync('authorize'),

  getUserInfo: mockAsync('getUserInfo'),

  requestPayment: mockAsync('requestPayment'),

  chooseAddress: mockAsync('chooseAddress'),

  addCard: mockAsync('addCard'),
  openCard: mockAsync('openCard'),

  openSetting: mockAsync('openSetting'),
  getSetting: mockAsync('getSetting'),

  getWeRunData: mockAsync('getWeRunData'),

  navigateToMiniProgram: mockAsync('navigateToMiniProgram'),
  navigateBackMiniProgram: mockAsync('navigateBackMiniProgram'),

  chooseInvoiceTitle: mockAsync('chooseInvoiceTitle'),

  checkIsSupportSoterAuthentication: mockAsync('checkIsSupportSoterAuthentication'),
  startSoterAuthentication: mockAsync('startSoterAuthentication'),
  checkIsSoterEnrolledInDevice: mockAsync('checkIsSoterEnrolledInDevice'),

  getUpdateManager: mockAsync('getUpdateManager'),

  createWorker: mockAsync('createWorker'),

  // network
  // TODO

  // media
  // TOOD
  
  // file
  // TODO

  // data
  ...dataApi,

  // location
  chooseLocation(options = {}) {
    _.runInAsync(options, {
      errMsg: 'chooseLocation:ok',
      address: '广东省广州市海珠区tit创意园品牌街',
      name: '腾讯微信总部',
      latitude: 23.1001,
      longitude: 113.32456,
    })
  },
  getLocation(options = {}) {
    _.runInAsync(options, {
      errMsg: 'getLocation:ok',
      accuracy: 65,
      altitude: 0,
      latitude: 23.12908,
      longitude: 113.26436,
      speed: -1,
      verticalAccuracy: 65,
      horizontalAccuracy: 65,
    })
  },
  openLocation: mockAsync('openLocation'),
  
  // device
  // TODO
  
  // open
  // TODO
  getAccountInfoSync: mockSync({
    miniprogram: { appId: 'wx4f4bc4dec97d474b' },
  }),

  // update
  // TODO
  
  // worker
  // TODO
  
  // report
  reportMonitor: mockSync(null),
  
  // miniprogram
  // TODO
  
  // base
  canIUse: mockSync(true),

  // canvas
  // TODO

  // debug
  getLogManager: mockSync(console),
  setEnableDebug: mockSync(null),

  // thirdparty
  getExtConfig(options = {}) {
    _.runInAsync(options, {
      errMsg: 'getExtConfig:ok',
      extConfig: wx.getExtConfigSync(),
    })
  },
  getExtConfigSync() {
    return {}
  },

  // map
  // TODO

  // route
  navigateTo: mockAsync('navigateTo'),
  redirectTo: mockAsync('redirectTo'),
  switchTab: mockAsync('switchTab'),
  navigateBack: mockAsync('navigateBack'),
  reLaunch: mockAsync('reLaunch'),

  // share
  getShareInfo(options = {}) {
    _.runInAsync(options, {
      errMsg: 'getShareInfo:ok',
      encryptedData: 'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZMQmRzooG2xrDcvSnxIMXFufNstNGTyaGS9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+3hVbJSRgv+4lGOETKUQz6OYStslQ142dNCuabNPGBzlooOmB231qMM85d2/fV6ChevvXvQP8Hkue1poOFtnEtpyxVLW1zAo6/1Xx1COxFvrc2d7UL/lmHInNlxuacJXwu0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn/Hz7saL8xz+W//FRAUid1OksQaQx4CMs8LOddcQhULW4ucetDf96JcR3g0gfRK4PC7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns/8wR2SiRS7MNACwTyrGvt9ts8p12PKFdlqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYVoKlaRv85IfVunYzO0IKXsyl7JCUjCpoG20f0a04COwfneQAGGwd5oa+T8yO5hzuyDb/XcxxmK01EpqOyuxINew==',
      iv: 'r7BXXKkLb8qrSNn05n0qiA==',
    })
  },
  hideShareMenu: mockAsync('hideShareMenu'),
  showShareMenu: mockAsync('showShareMenu'),
  updateShareMenu: mockAsync('updateShareMenu'),

  // system
  getSystemInfo(options = {}) {
    _.runInAsync(options, {
      errMsg: 'getSystemInfo:ok',
      ...wx.getSystemInfoSync(),
    })
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

  // wxml
  // TODO
}
