const Animation = require('./animation')
const dataApi = require('./data')
const systemApi = require('./system')
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

  // data
  ...dataApi,

  getLocation: mockAsync('getLocation'),
  chooseLocation: mockAsync('chooseLocation'),

  openLocation: mockAsync('openLocation'),

  createMapContext: mockAsync('createMapContext'),

  // system
  ...systemApi,

  // base
  canIUse: mockSync(true),

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

  // route
  navigateTo: mockAsync('navigateTo'),
  redirectTo: mockAsync('redirectTo'),
  switchTab: mockAsync('switchTab'),
  navigateBack: mockAsync('navigateBack'),
  reLaunch: mockAsync('reLaunch'),

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

  getExtConfig: mockAsync('getExtConfig'),
  getExtConfigSync: mockAsync('getExtConfigSync'),

  login: mockAsync('login'),
  checkSession: mockAsync('checkSession'),

  authorize: mockAsync('authorize'),

  getUserInfo: mockAsync('getUserInfo'),

  requestPayment: mockAsync('requestPayment'),

  showShareMenu: mockAsync('showShareMenu'),
  hideShareMenu: mockAsync('hideShareMenu'),
  updateShareMenu: mockAsync('updateShareMenu'),
  getShareInfo: mockAsync('getShareInfo'),

  chooseAddress: mockAsync('chooseAddress'),

  addCard: mockAsync('addCard'),
  openCard: mockAsync('openCard'),

  openSetting: mockAsync('openSetting'),
  getSetting: mockAsync('getSetting'),

  getWeRunData: mockAsync('getWeRunData'),

  getAccountInfoSync: mockAsync('getAccountInfoSync'),

  navigateToMiniProgram: mockAsync('navigateToMiniProgram'),
  navigateBackMiniProgram: mockAsync('navigateBackMiniProgram'),

  chooseInvoiceTitle: mockAsync('chooseInvoiceTitle'),

  checkIsSupportSoterAuthentication: mockAsync('checkIsSupportSoterAuthentication'),
  startSoterAuthentication: mockAsync('startSoterAuthentication'),
  checkIsSoterEnrolledInDevice: mockAsync('checkIsSoterEnrolledInDevice'),

  getUpdateManager: mockAsync('getUpdateManager'),

  createWorker: mockAsync('createWorker'),

  getLogManager: mockAsync('getLogManager'),

  reportMonitor: mockAsync('reportMonitor'),

  setEnableDebug: mockAsync('setEnableDebug'),
}
