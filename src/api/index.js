const Animation = require('./animation')
const UpdateManager = require('./update-manager')
const _ = require('./utils')
const {
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
} = require('./mock')
const {LogManager, RealtimeLogManager} = require('./log')
const Performance = require('./performance')
const {
  RequestTask,
  DownloadTask,
  UploadTask,
  SocketTask,
  TCPSocket,
  UDPSocket,
} = require('./network')
const SelectorQuery = require('./selector-query')
const {OffscreenCanvas, CanvasContext} = require('./canvas')
const {
  MapContext,
  VideoContext,
  LivePlayerContext,
  LivePusherContext,
  CameraContext,
} = require('./context')

let nextTickQueue = []
let nextTickTimer = null

const updateManager = new UpdateManager()
const realtimeLogManager = new RealtimeLogManager()
const logManager = new LogManager()
const performance = new Performance()

const MockBezier = () => t => t

module.exports = {
  // 基础
  env: {USER_DATA_PATH: '/usr/'},
  canIUse: _.mockSync(true),
  base64ToArrayBuffer: _.mockSync(Uint8Array.from([]).buffer),
  arrayBufferToBase64: _.mockSync(''),

  // 基础 - 系统
  openSystemBluetoothSetting: _.mockAsyncAndPromise(
    'openSystemBluetoothSetting'
  ),
  openAppAuthorizeSetting: _.mockAsyncAndPromise('openAppAuthorizeSetting'),
  getWindowInfo: _.mockSync({
    pixelRatio: 3,
    screenWidth: 428,
    screenHeight: 926,
    windowWidth: 428,
    windowHeight: 835,
    statusBarHeight: 47,
    safeArea: {
      left: 0,
      right: 428,
      top: 47,
      bottom: 892,
      width: 428,
      height: 845,
    },
    screenTop: 91,
  }),
  getSystemSetting: _.mockSync({
    bluetoothEnabled: true,
    deviceOrientation: 'portrait',
    locationEnabled: true,
    wifiEnabled: true,
  }),
  getSystemInfoSync: _.mockSync(systemInfo),
  getSystemInfoAsync: _.mockAsync('getSystemInfoAsync', systemInfo),
  getSystemInfo: _.mockAsyncAndPromise('getSystemInfo', systemInfo),
  getSkylineInfoSync: _.mockSync(skylineInfo),
  getSkylineInfo: _.mockAsync('getSkylineInfo', skylineInfo),
  getRendererUserAgent: _.mockAsyncAndPromise(
    'getRendererUserAgent',
    {userAgent},
    userAgent
  ),
  getDeviceInfo: _.mockSync({
    abi: '',
    deviceAbi: '',
    benchmarkLevel: 1,
    brand: 'devtools',
    model: 'iPhone 12/13 Pro Max',
    system: 'iOS 10.0.1',
    platform: 'ios',
    cpuType: '',
    memorySize: '',
  }),
  getAppBaseInfo: _.mockSync({
    SDKVersion: '2.32.3',
    enableDebug: false,
    host: {env: 'WeChat'},
    language: 'zh_CN',
    version: '8.0.5',
    theme: 'light',
  }),
  getAppAuthorizeSetting: _.mockSync({
    albumAuthorized: 'not determined',
    bluetoothAuthorized: 'not determined',
    cameraAuthorized: 'not determined',
    locationAuthorized: 'not determined',
    locationReducedAccuracy: true,
    microphoneAuthorized: 'not determined',
    notificationAuthorized: 'not determined',
    notificationAlertAuthorized: 'not determined',
    notificationBadgeAuthorized: 'not determined',
    notificationSoundAuthorized: 'not determined',
    phoneCalendarAuthorized: 'not determined',
  }),

  // 基础 - 更新
  updateWeChatApp: _.mockAsyncAndPromise('updateWeChatApp'),
  getUpdateManager: () => updateManager,

  // 基础 - 小程序 - 生命周期
  getLaunchOptionsSync: _.mockSync(launchOptions),
  getEnterOptionsSync: _.mockSync(launchOptions),

  // 基础 - 小程序 - 应用级事件
  onUnhandledRejection() {},
  onThemeChange() {},
  onPageNotFound() {},
  onLazyLoadError() {},
  onError() {},
  onAudioInterruptionEnd() {},
  onAudioInterruptionBegin() {},
  onAppShow() {},
  onAppHide() {},
  offUnhandledRejection() {},
  offThemeChange() {},
  offPageNotFound() {},
  offLazyLoadError() {},
  offError() {},
  offAudioInterruptionEnd() {},
  offAudioInterruptionBegin() {},
  offAppShow() {},
  offAppHide() {},

  // 基础 - 小程序 - 调试
  setEnableDebug: _.mockAsyncAndPromise('setEnableDebug'),
  getRealtimeLogManager: () => realtimeLogManager,
  getLogManager: () => logManager,

  // 基础 - 小程序 - 性能
  reportPerformance() {},
  preloadWebview: _.mockAsync('preloadWebview'),
  preloadSkylineView: _.mockAsync('preloadSkylineView'),
  preloadAssets: _.mockAsync('preloadAssets'),
  getPerformance: () => performance,

  // 基础 - 小程序 - 分包加载
  preDownloadSubpackage: () => preDownloadSubpackageTask,
  getUserCryptoManager: () => userCryptoManager,

  // 路由
  switchTab: _.mockAsyncAndPromise('switchTab'),
  reLaunch: _.mockAsyncAndPromise('reLaunch'),
  redirectTo: _.mockAsyncAndPromise('redirectTo'),
  navigateTo: _.mockAsyncAndPromise('navigateTo', {eventChannel}),
  navigateBack: _.mockAsyncAndPromise('navigateBack'),

  // 路由 - 自定义路由
  router: {
    addRouteBuilder() {},
    getRouteContext: () => null,
    removeRouteBuilder() {},
  },

  // 跳转
  openEmbeddedMiniProgram: _.mockAsyncAndPromise('openEmbeddedMiniProgram'),
  navigateToMiniProgram: _.mockAsyncAndPromise('navigateToMiniProgram'),
  navigateBackMiniProgram: _.mockAsyncAndPromise('navigateBackMiniProgram'),
  exitMiniProgram: _.mockAsyncAndPromise('exitMiniProgram'),

  // 转发
  updateShareMenu: _.mockAsyncAndPromise('updateShareMenu'),
  showShareMenu: _.mockAsyncAndPromise('showShareMenu'),
  showShareImageMenu: _.mockAsyncAndPromise('showShareImageMenu'),
  shareVideoMessage: _.mockAsyncAndPromise('shareVideoMessage'),
  shareFileMessage: _.mockAsyncAndPromise('shareFileMessage'),
  onCopyUrl() {},
  offCopyUrl() {},
  hideShareMenu: _.mockAsyncAndPromise('hideShareMenu'),
  getShareInfo: _.mockAsync('getShareInfo', {
    encryptedData: '987654321',
    iv: '123456789',
    cloudID: '',
  }),
  authPrivateMessage: _.mockAsync('authPrivateMessage', {
    valid: true,
    encryptedData: '987654321',
    iv: '123456789',
  }),

  // 界面 - 交互
  showToast: _.mockAsyncAndPromise('showToast'),
  showModal: _.mockAsyncAndPromise('showModal', {
    content: '',
    confirm: true,
    cancel: false,
  }),
  showLoading: _.mockAsyncAndPromise('showLoading'),
  showActionSheet: _.mockAsyncAndPromise('showActionSheet', {tapIndex: 0}),
  hideToast: _.mockAsyncAndPromise('hideToast'),
  hideLoading: _.mockAsyncAndPromise('hideLoading'),
  enableAlertBeforeUnload: _.mockAsync('enableAlertBeforeUnload'),
  disableAlertBeforeUnload: _.mockAsync('disableAlertBeforeUnload'),

  // 界面 - 导航栏
  showNavigationBarLoading: _.mockAsyncAndPromise('showNavigationBarLoading'),
  setNavigationBarTitle: _.mockAsyncAndPromise('setNavigationBarTitle'),
  setNavigationBarColor: _.mockAsyncAndPromise('setNavigationBarColor'),
  hideNavigationBarLoading: _.mockAsyncAndPromise('hideNavigationBarLoading'),
  hideHomeButton: _.mockAsyncAndPromise('hideHomeButton'),

  // 界面 - 背景
  setBackgroundTextStyle: _.mockAsyncAndPromise('setBackgroundTextStyle'),
  setBackgroundColor: _.mockAsyncAndPromise('setBackgroundColor'),

  // 界面 - Tab Bar
  showTabBarRedDot: _.mockAsyncAndPromise('showTabBarRedDot'),
  showTabBar: _.mockAsyncAndPromise('showTabBar'),
  setTabBarStyle: _.mockAsyncAndPromise('setTabBarStyle'),
  setTabBarItem: _.mockAsyncAndPromise('setTabBarItem'),
  setTabBarBadge: _.mockAsyncAndPromise('setTabBarBadge'),
  removeTabBarBadge: _.mockAsyncAndPromise('removeTabBarBadge'),
  hideTabBarRedDot: _.mockAsyncAndPromise('hideTabBarRedDot'),
  hideTabBar: _.mockAsyncAndPromise('hideTabBar'),

  // 界面 - 字体
  loadFontFace: _.mockAsyncAndPromise('loadFontFace', {status: 'loaded'}),

  // 界面 - 下拉刷新
  stopPullDownRefresh: _.mockAsyncAndPromise('stopPullDownRefresh'),
  startPullDownRefresh: _.mockAsyncAndPromise('startPullDownRefresh'),

  // 界面 - 滚动
  pageScrollTo: _.mockAsyncAndPromise('pageScrollTo'),

  // 界面 - 动画
  createAnimation: (transition = {}) => new Animation(transition),

  // 界面 - 置顶
  setTopBarText: _.mockAsyncAndPromise('setTopBarText'),

  // 界面 - 自定义组件
  nextTick(func) {
    if (typeof func !== 'function') return

    nextTickQueue.push(func)

    if (nextTickTimer) return
    nextTickTimer = setTimeout(() => {
      const funcQueue = nextTickQueue
      nextTickQueue = []
      nextTickTimer = null

      for (const func of funcQueue) {
        if (func) func()
      }
    }, 0)
  },

  // 界面 - 菜单
  getMenuButtonBoundingClientRect: _.mockSync({
    width: 87,
    height: 32,
    top: 51,
    right: 421,
    bottom: 83,
    left: 334,
  }),

  // 界面 - 窗口
  setWindowSize: _.mockAsync('setWindowSize'),
  onWindowResize() {},
  offWindowResize() {},
  checkIsPictureInPictureActive: _.mockSync(false),

  // 界面 - worklet 动画
  worklet: {
    cancelAnimation() {},

    derived(updaterWorklet) {
      if (typeof updaterWorklet !== 'function') return
      return {value: updaterWorklet()}
    },

    shared: value => ({value}),

    decay(config) {
      if (config && config.clamp) return config.clamp[0] || 0
      return 0
    },

    Easing: {
      bounce: t => {
        if (t < 1 / 2.75) return 7.5625 * t * t
        if (t < 2 / 2.75) {
          const t2 = t - 1.5 / 2.75
          return 7.5625 * t2 * t2 + 0.75
        }
        if (t < 2.5 / 2.75) {
          const t2 = t - 2.25 / 2.75
          return 7.5625 * t2 * t2 + 0.9375
        }
        const t2 = t - 2.625 / 2.75
        return 7.5625 * t2 * t2 + 0.984375
      },
      ease: t => MockBezier(0.42, 0, 1, 1)(t),
      elastic:
        (bounciness = 1) => t => 1 -
          (Math.cos((t * Math.PI) / 2) ** 3) *
            Math.cos(t * bounciness * Math.PI),
      linear: t => t,
      quad: t => t * t,
      cubic: t => t * t * t,
      poly: n => t => t ** n,
      bezier: (x1, y1, x2, y2) => ({
        factory: () => MockBezier(x1, y1, x2, y2),
      }),
      circle: t => 1 - Math.sqrt(1 - t * t),
      sin: t => 1 - Math.cos((t * Math.PI) / 2),
      exp: t => 2 ** (10 * (t - 1)),
      in: easing => easing,
      out: easing => t => 1 - easing(1 - t),
      inOut: easing => t => {
        if (t < 0.5) return easing(t * 2) / 2
        return 1 - easing((1 - t) * 2) / 2
      },
    },

    spring(value, options, callback) {
      if (typeof callback === 'function') setTimeout(() => callback(false), 100)
      return value
    },

    timing(value, options, callback) {
      if (typeof callback === 'function') setTimeout(() => callback(false), 100)
      return value
    },

    delay: (delayTime, delayedAnimation) => delayedAnimation || 0,

    repeat(animation, numberOfReps, reverse, callback) {
      if (typeof callback === 'function') setTimeout(() => callback(false), 100)
      return animation || 0
    },

    sequence: animation => animation || 0,

    runOnJS: func => (typeof func === 'function' ? func : () => {}),

    runOnUI: func => (typeof func === 'function' ? func : () => {}),
  },

  // 网络 - 发起请求
  request: options => new RequestTask(options),

  // 网络 - 下载
  downloadFile: options => new DownloadTask(options),

  // 网络 - 上传
  uploadFile: options => new UploadTask(options),

  // 网络 - WebSocket
  sendSocketMessage: _.mockAsyncAndPromise('sendSocketMessage'),
  onSocketOpen() {},
  onSocketMessage() {},
  onSocketError() {},
  onSocketClose() {},
  connectSocket: options => new SocketTask(options),
  closeSocket: _.mockAsync('closeSocket'),

  // 网络 - mDNS
  stopLocalServiceDiscovery: _.mockAsyncAndPromise('stopLocalServiceDiscovery'),
  startLocalServiceDiscovery: _.mockAsyncAndPromise(
    'startLocalServiceDiscovery'
  ),
  onLocalServiceResolveFail() {},
  onLocalServiceLost() {},
  onLocalServiceFound() {},
  onLocalServiceDiscoveryStop() {},
  offLocalServiceResolveFail() {},
  offLocalServiceLost() {},
  offLocalServiceFound() {},
  offLocalServiceDiscoveryStop() {},

  // 网络 - TCP 通信
  createTCPSocket: () => new TCPSocket(),

  // 网络 - UDP 通信
  createUDPSocket: () => new UDPSocket(),

  // 支付
  requestPluginPayment: _.mockAsync('requestPluginPayment'),
  requestPayment: _.mockAsyncAndPromise('requestPayment'),

  // 数据缓存
  setStorageSync() {},
  setStorage: _.mockAsync('setStorage'),
  revokeBufferURL() {},
  removeStorageSync() {},
  removeStorage: _.mockAsync('removeStorage'),
  getStorageSync: _.mockSync(''),
  getStorageInfoSync: _.mockSync({
    currentSize: 1,
    keys: [],
    limitSize: 10240,
  }),
  getStorageInfo: _.mockAsync('getStorageInfo', {
    currentSize: 1,
    keys: [],
    limitSize: 10240,
  }),
  getStorage: _.mockAsync('getStorage', {data: ''}),
  createBufferURL: _.mockSync(''),
  clearStorageSync() {},
  clearStorage: _.mockAsync('clearStorage'),
  batchSetStorageSync() {},
  batchSetStorage: _.mockAsync('batchSetStorage'),
  batchGetStorageSync: _.mockSync([]),
  batchGetStorage: _.mockAsync('batchGetStorage', {dataList: []}),

  // 数据缓存 - 周期性更新
  setBackgroundFetchToken: _.mockAsyncAndPromise('setBackgroundFetchToken'),
  onBackgroundFetchData() {},
  getBackgroundFetchToken: _.mockAsyncAndPromise('getBackgroundFetchToken', {
    token: '',
  }),
  getBackgroundFetchData: _.mockAsyncAndPromise('getBackgroundFetchData', {
    fetchedData: '',
    timeStamp: Date.now(),
    path: '/',
    query: '',
    scene: 1001,
  }),

  // 数据缓存 - 缓存管理器
  createCacheManager: () => cacheManager,

  // 数据分析
  reportMonitor() {},
  reportEvent() {},
  reportAnalytics() {},
  getExptInfoSync: _.mockSync({}),

  // XR-FRAME
  // 暂不支持

  // 画布
  createOffscreenCanvas: () => new OffscreenCanvas(),
  createCanvasContext: () => new CanvasContext(),
  canvasToTempFilePath: _.mockAsyncAndPromise('canvasToTempFilePath', {
    tempFilePath: '',
  }),
  canvasPutImageData: _.mockAsyncAndPromise('canvasPutImageData'),
  canvasGetImageData: _.mockAsyncAndPromise('canvasGetImageData', {
    width: 100,
    height: 100,
    data: Uint8Array.from(0),
  }),

  // 媒体 - 地图
  createMapContext: () => new MapContext(),

  // 媒体 - 图片
  saveImageToPhotosAlbum: _.mockAsyncAndPromise('saveImageToPhotosAlbum'),
  previewMedia: _.mockAsyncAndPromise('previewMedia'),
  previewImage: _.mockAsyncAndPromise('previewImage'),
  getImageInfo: _.mockAsyncAndPromise('getImageInfo', {
    width: 100,
    height: 100,
    path: '/',
    orientation: 'up',
    type: 'jpeg',
  }),
  editImage: _.mockAsync('editImage', {tempFilePath: '/'}),
  cropImage: _.mockAsync('cropImage', {tempFilePath: '/'}),
  compressImage: _.mockAsyncAndPromise('compressImage', {tempFilePath: '/'}),
  chooseMessageFile: _.mockAsyncAndPromise('chooseMessageFile', {
    tempFiles: [],
  }),
  chooseImage: _.mockAsyncAndPromise('chooseImage', {
    tempFilePaths: [],
    tempFiles: [],
  }),

  // 媒体 - 视频
  saveVideoToPhotosAlbum: _.mockAsyncAndPromise('saveVideoToPhotosAlbum'),
  openVideoEditor: _.mockAsync('openVideoEditor', {
    duration: 0,
    size: 1024,
    tempFilePath: '',
    tempThumbPath: '',
  }),
  getVideoInfo: _.mockAsyncAndPromise('getVideoInfo', {
    orientation: 'up',
    type: 'mp4',
    duration: 0,
    size: 0,
    height: 0,
    width: 0,
    fps: 0,
    bitrate: 0,
  }),
  createVideoContext: () => new VideoContext(),
  compressVideo: _.mockAsyncAndPromise('compressVideo', {
    tempFilePath: '',
    size: 1024,
  }),
  chooseVideo: _.mockAsyncAndPromise('chooseVideo', {
    tempFilePath: '',
    duration: 0,
    size: 1024,
    height: 0,
    width: 0,
  }),
  chooseMedia: _.mockAsyncAndPromise('chooseMedia', {
    tempFiles: [],
    type: 'mix',
  }),

  // 媒体 - 音频
  stopVoice: _.mockAsyncAndPromise('stopVoice'),
  setInnerAudioOption: _.mockAsyncAndPromise('setInnerAudioOption'),
  playVoice: _.mockAsyncAndPromise('playVoice'),
  pauseVoice: _.mockAsyncAndPromise('pauseVoice'),
  getAvailableAudioSources: _.mockAsyncAndPromise('getAvailableAudioSources', {
    audioSources: ['auto'],
  }),
  createWebAudioContext: _.mockSync({
    state: '',
    onstatechange() {},
    currentTime: 0,
    WebAudioContextNode: {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      forwardX: 0,
      forwardY: 0,
      forwardZ: 0,
      upX: 0,
      upY: 0,
      upZ: 0,
      setOrientation() {},
      setPosition() {},
    },
    listener() {},
    sampleRate: 0,
    close: _.mockSync(Promise.resolve({})),
    createAnalyser: _.mockSync(null),
    createBiquadFilter: _.mockSync(null),
    createBuffer: _.mockSync(audioBuffer),
    createBufferSource: _.mockSync(null),
    createChannelMerger: _.mockSync(null),
    createChannelSplitter: _.mockSync(null),
    createConstantSource: _.mockSync(null),
    createDelay: _.mockSync(null),
    createDynamicsCompressor: _.mockSync(null),
    createGain: _.mockSync(null),
    createIIRFilter: _.mockSync(null),
    createOscillator: _.mockSync(null),
    createPanner: _.mockSync(null),
    createPeriodicWave: _.mockSync(null),
    createScriptProcessor: _.mockSync(null),
    createWaveShaper: _.mockSync(null),
    decodeAudioData: _.mockSync(audioBuffer),
    resume: _.mockSync(Promise.resolve({})),
    suspend: _.mockSync(Promise.resolve({})),
  }),
  createMediaAudioPlayer: _.mockSync({
    volume: 0,
    addAudioSource: _.mockSync(Promise.resolve({})),
    destroy: _.mockSync(Promise.resolve({})),
    removeAudioSource: _.mockSync(Promise.resolve({})),
    start: _.mockSync(Promise.resolve({})),
    stop: _.mockSync(Promise.resolve({})),
  }),
  createInnerAudioContext: _.mockSync({
    src: '',
    startTime: 0,
    autoplay: true,
    loop: true,
    obeyMuteSwitch: true,
    volume: 0,
    playbackRate: 0,
    duration: 0,
    currentTime: 0,
    paused: true,
    buffered: 0,
    referrerPolicy: '',
    destroy() {},
    offCanplay() {},
    offEnded() {},
    offError() {},
    offPause() {},
    offPlay() {},
    offSeeked() {},
    offSeeking() {},
    offStop() {},
    offTimeUpdate() {},
    offWaiting() {},
    onCanplay() {},
    onEnded() {},
    onError() {},
    onPause() {},
    onPlay() {},
    onSeeked() {},
    onSeeking() {},
    onStop() {},
    onTimeUpdate() {},
    onWaiting() {},
    pause() {},
    play() {},
    seek() {},
    stop() {},
  }),
  createAudioContext: _.mockSync({
    pause() {},
    play() {},
    seek() {},
    setSrc() {},
  }),

  // 媒体 - 背景音频
  stopBackgroundAudio: _.mockAsyncAndPromise('stopBackgroundAudio'),
  seekBackgroundAudio: _.mockAsyncAndPromise('seekBackgroundAudio'),
  playBackgroundAudio: _.mockAsyncAndPromise('playBackgroundAudio'),
  pauseBackgroundAudio: _.mockAsyncAndPromise('pauseBackgroundAudio'),
  onBackgroundAudioStop() {},
  onBackgroundAudioPlay() {},
  onBackgroundAudioPause() {},
  getBackgroundAudioPlayerState: _.mockAsyncAndPromise(
    'getBackgroundAudioPlayerState',
    {
      duration: 0,
      currentPosition: 0,
      status: 0,
      downloadPercent: 0,
      dataUrl: '',
    }
  ),
  getBackgroundAudioManager: _.mockSync({
    src: '',
    startTime: 0,
    title: '',
    epname: '',
    singer: '',
    coverImgUrl: '',
    webUrl: '',
    protocol: '',
    playbackRate: 0,
    duration: 0,
    currentTime: 0,
    paused: true,
    buffered: 0,
    referrerPolicy: '',
    onCanplay() {},
    onEnded() {},
    onError() {},
    onNext() {},
    onPause() {},
    onPlay() {},
    onPrev() {},
    onSeeked() {},
    onSeeking() {},
    onStop() {},
    onTimeUpdate() {},
    onWaiting() {},
    pause() {},
    play() {},
    seek() {},
    stop() {},
  }),

  // 媒体 - 实时音视频
  createLivePusherContext: () => new LivePusherContext(),
  createLivePlayerContext: () => new LivePlayerContext(),

  // 媒体 - 录音
  stopRecord: _.mockAsyncAndPromise('stopRecord'),
  startRecord: _.mockAsyncAndPromise('startRecord', {tempFilePath: '/'}),
  getRecorderManager: _.mockSync({
    onError() {},
    onFrameRecorded() {},
    onInterruptionBegin() {},
    onInterruptionEnd() {},
    onPause() {},
    onResume() {},
    onStart() {},
    onStop() {},
    pause() {},
    resume() {},
    start() {},
    stop() {},
  }),

  // 媒体 - 相机
  createCameraContext: () => new CameraContext(),

  // 媒体 - 音视频合成
  createMediaContainer: _.mockSync({
    addTrack() {},
    destroy() {},
    export() {},
    extractDataSource() {},
    removeTrack() {},
  }),

  // 媒体 - 实时语音
  updateVoIPChatMuteConfig: _.mockAsyncAndPromise('updateVoIPChatMuteConfig'),
  subscribeVoIPVideoMembers: _.mockAsyncAndPromise('subscribeVoIPVideoMembers'),
  setEnable1v1Chat: _.mockAsyncAndPromise('setEnable1v1Chat'),
  onVoIPVideoMembersChanged() {},
  onVoIPChatStateChanged() {},
  onVoIPChatSpeakersChanged() {},
  onVoIPChatMembersChanged() {},
  onVoIPChatInterrupted() {},
  offVoIPVideoMembersChanged() {},
  offVoIPChatStateChanged() {},
  offVoIPChatSpeakersChanged() {},
  offVoIPChatMembersChanged() {},
  offVoIPChatInterrupted() {},
  joinVoIPChat: _.mockAsyncAndPromise('joinVoIPChat', {openIdList: []}),
  join1v1Chat: _.mockAsyncAndPromise('join1v1Chat'),
  exitVoIPChat: _.mockAsyncAndPromise('exitVoIPChat'),

  // 媒体 - 画面录制器
  createMediaRecorder: _.mockSync({
    destroy: _.mockSync(Promise.resolve({})),
    off() {},
    on() {},
    pause: _.mockSync(Promise.resolve({})),
    requestFrame: _.mockSync(Promise.resolve({})),
    resume: _.mockSync(Promise.resolve({})),
    start: _.mockSync(Promise.resolve({})),
    stop: _.mockSync(Promise.resolve({})),
  }),

  // 媒体 - 视频解码器
  createVideoDecoder: _.mockSync({
    getFrameData: _.mockSync({
      width: 0,
      height: 0,
      data: Uint8Array.from(0).buffer,
      pkPts: 0,
      pkDts: 0,
    }),
    off() {},
    on() {},
    remove: _.mockSync(Promise.resolve({})),
    seek: _.mockSync(Promise.resolve({})),
    start: _.mockSync(Promise.resolve({})),
    stop: _.mockSync(Promise.resolve({})),
  }),

  // 位置
  stopLocationUpdate: _.mockAsyncAndPromise('stopLocationUpdate'),
  startLocationUpdateBackground: _.mockAsyncAndPromise(
    'startLocationUpdateBackground'
  ),
  startLocationUpdate: _.mockAsyncAndPromise('startLocationUpdate'),
  openLocation: _.mockAsyncAndPromise('openLocation'),
  onLocationChangeError() {},
  onLocationChange() {},
  offLocationChangeError() {},
  offLocationChange() {},
  getLocation: _.mockAsyncAndPromise('getLocation', {
    latitude: 23.12908,
    longitude: 113.26436,
    speed: -1,
    accuracy: 65,
    altitude: 0,
    verticalAccuracy: 65,
    horizontalAccuracy: 65,
  }),
  getFuzzyLocation: _.mockAsync('getFuzzyLocation', {
    latitude: 23.12908,
    longitude: 113.26436,
  }),
  choosePoi: _.mockAsyncAndPromise('choosePoi', {
    type: 2,
    city: '广州',
    name: '腾讯微信总部',
    address: '广东省广州市海珠区tit创意园品牌街',
    latitude: 23.1001,
    longitude: 113.32456,
  }),
  chooseLocation: _.mockAsyncAndPromise('chooseLocation', {
    name: '腾讯微信总部',
    address: '广东省广州市海珠区tit创意园品牌街',
    latitude: 23.1001,
    longitude: 113.32456,
  }),

  // 文件
  saveFileToDisk: _.mockAsync('saveFileToDisk'),
  openDocument: _.mockAsyncAndPromise('openDocument'),
  getFileSystemManager: _.mockSync({
    access: _.mockAsync('access'),
    accessSync() {},
    appendFile: _.mockAsync('appendFile'),
    appendFileSync() {},
    close: _.mockAsync('close'),
    closeSync() {},
    copyFile: _.mockAsync('copyFile'),
    copyFileSync() {},
    fstat: _.mockAsync('fstat', stats),
    fstatSync: _.mockSync(stats),
    ftruncate: _.mockAsync('ftruncate'),
    ftruncateSync() {},
    getFileInfo: _.mockAsync('getFileInfo', {size: 1024}),
    getSavedFileList: _.mockAsync('getSavedFileList', {fileList: []}),
    mkdir: _.mockAsync('mkdir'),
    mkdirSync() {},
    open: _.mockAsync('open', {fd: ''}),
    openSync: _.mockSync(''),
    read: _.mockAsync('read', {
      bytesRead: 0,
      arrayBuffer: Uint8Array.from([]).buffer,
    }),
    readCompressedFile: _.mockAsync('readCompressedFile', {
      data: Uint8Array.from([]).buffer,
    }),
    readCompressedFileSync: _.mockSync(Uint8Array.from([]).buffer),
    readdir: _.mockAsync('readdir', {files: []}),
    readdirSync: _.mockSync([]),
    readFile: _.mockAsync('readFile', {data: ''}),
    readFileSync: _.mockSync(''),
    readSync: _.mockSync({
      bytesRead: 0,
      arrayBuffer: Uint8Array.from([]).buffer,
    }),
    readZipEntry: _.mockAsync('readZipEntry', {entries: {}}),
    removeSavedFile: _.mockAsync('removeSavedFile'),
    rename: _.mockAsync('rename'),
    renameSync() {},
    rmdir: _.mockAsync('rmdir'),
    rmdirSync() {},
    saveFile: _.mockAsync('saveFile', {savedFilePath: ''}),
    saveFileSync: _.mockSync(''),
    stat: _.mockAsync('stat', {stats}),
    statSync: _.mockSync(stats),
    truncate: _.mockAsync('truncate'),
    truncateSync() {},
    unlink: _.mockAsync('unlink'),
    unlinkSync() {},
    unzip: _.mockAsync('unzip'),
    write: _.mockAsync('write', {bytesWritten: 0}),
    writeFile: _.mockAsync('writeFile'),
    writeFileSync() {},
    writeSync: _.mockSync({bytesWritten: 0}),
  }),

  // 开放接口 - 登录
  pluginLogin: _.mockAsync('pluginLogin', {code: '123456789'}),
  login: _.mockAsync('login', {code: '123456789'}),
  checkSession: _.mockAsyncAndPromise('checkSession'),

  // 开放接口 - 帐号信息
  getAccountInfoSync: _.mockSync({
    miniProgram: {
      appId: 'wx123456789',
      envVersion: 'develop',
      version: '',
    },
    plugin: undefined,
  }),

  // 开放接口 - 用户信息
  getUserProfile: _.mockAsyncAndPromise('getUserProfile', userInfo),
  getUserInfo: _.mockAsync('getUserInfo', userInfo),

  // 开放接口 - 授权
  authorizeForMiniProgram: _.mockAsync('authorizeForMiniProgram'),
  authorize: _.mockAsyncAndPromise('authorize'),

  // 开放接口 - 设置
  openSetting: _.mockAsyncAndPromise('openSetting', setting),
  getSetting: _.mockAsyncAndPromise('getSetting', setting),

  // 开放接口 - 收货地址
  chooseAddress: _.mockAsyncAndPromise('chooseAddress', {
    userName: '张三',
    postalCode: '510000',
    provinceName: '广东省',
    cityName: '广州市',
    countyName: '海珠区',
    detailInfo: '新港中路397号',
    detailInfoNew: '',
    nationalCode: '510000',
    telNumber: '020-81167888',
  }),

  // 开放接口 - 卡券
  openCard: _.mockAsyncAndPromise('openCard'),
  addCard: _.mockAsyncAndPromise('addCard', {cardList: []}),

  // 开放接口 - 发票
  chooseInvoiceTitle: _.mockAsyncAndPromise('chooseInvoiceTitle', {
    type: '0',
    title: '广州腾讯科技有限公司',
    taxNumber: '91440101327598294H',
    companyAddress: '广州市海珠区新港中路397号自编72号(商业街F5-1)',
    telephone: '020-81167888',
    bankName: '招商银行股份有限公司广州市体育东路支行',
    bankAccount: '1209 0928 2210 301',
  }),
  chooseInvoice: _.mockAsyncAndPromise('chooseInvoice', {invoiceInfo: '{}'}),

  // 开放接口 - 生物认证
  startSoterAuthentication: _.mockAsyncAndPromise('startSoterAuthentication', {
    authMode: '',
    resultJSON:
      '{"raw":"msg","fid":"2","counter":123,"tee_n":"TEE Name","tee_v":"TEE Version","fp_n":"Fingerprint Sensor Name","fp_v":"Fingerprint Sensor Version","cpu_id":"CPU Id","uid":"21"}',
    resultJSONSignature: '',
  }),
  checkIsSupportSoterAuthentication: _.mockAsyncAndPromise(
    'checkIsSupportSoterAuthentication',
    {supportMode: ['fingerPrint']}
  ),
  checkIsSoterEnrolledInDevice: _.mockAsyncAndPromise(
    'checkIsSoterEnrolledInDevice',
    {isEnrolled: true}
  ),

  // 开放接口 - 微信运动
  shareToWeRun: _.mockAsyncAndPromise('shareToWeRun'),
  getWeRunData: _.mockAsync('getWeRunData', {
    encryptedData: '',
    iv: '',
    cloudID: '',
  }),

  // 开放接口 - 订阅消息
  requestSubscribeMessage: _.mockAsyncAndPromise('requestSubscribeMessage'),
  requestSubscribeDeviceMessage: _.mockAsyncAndPromise(
    'requestSubscribeDeviceMessage'
  ),

  // 开放接口 - 微信红包
  showRedPackage: _.mockAsyncAndPromise('showRedPackage'),

  // 开放接口 - 收藏
  addVideoToFavorites: _.mockAsyncAndPromise('addVideoToFavorites'),
  addFileToFavorites: _.mockAsyncAndPromise('addFileToFavorites'),

  // 开放接口 - 我的小程序
  checkIsAddedToMyMiniProgram: _.mockAsync('checkIsAddedToMyMiniProgram', {
    added: false,
  }),

  // 开放接口 - 车牌
  chooseLicensePlate: _.mockAsyncAndPromise('chooseLicensePlate', {
    plateNumber: '粤A88888',
  }),

  // 开放接口 - 我的视频号
  reserveChannelsLive() {},
  openChannelsUserProfile: _.mockAsync('openChannelsUserProfile'),
  openChannelsLive: _.mockAsync('openChannelsLive'),
  openChannelsEvent: _.mockAsync('openChannelsEvent'),
  openChannelsActivity: _.mockAsync('openChannelsActivity'),
  getChannelsShareKey: _.mockAsync('getChannelsShareKey', {
    sharerOpenId: '',
    promoter: {
      finderNickname: '',
      promoterId: '',
      promoterOpenId: '',
    },
  }),
  getChannelsLiveNoticeInfo: _.mockAsync('getChannelsLiveNoticeInfo', {
    noticeId: '',
    status: 1,
    startTime: '',
    headUrl: '',
    nickname: '',
    reservable: false,
    otherInfos: [],
  }),
  getChannelsLiveInfo: _.mockAsync('getChannelsLiveInfo', {
    feedId: '',
    nonceId: '',
    description: '',
    status: 3,
    headUrl: '',
    nickname: '',
    replayStatus: 6,
    otherInfos: [],
  }),

  // 开放接口 - 音视频通话
  requestDeviceVoIP: _.mockAsync('requestDeviceVoIP'),
  getDeviceVoIPList: _.mockAsync('getDeviceVoIPList', {list: []}),

  // 开放接口 - 微信群
  getGroupEnterInfo: _.mockAsync('getGroupEnterInfo', {
    encryptedData: '',
    iv: '',
    cloudID: '',
  }),

  // 开放接口 - 微信客服
  openCustomerServiceChat: _.mockAsync('openCustomerServiceChat'),

  // 设备 - 蓝牙 - 通用
  stopBluetoothDevicesDiscovery: _.mockAsyncAndPromise(
    'stopBluetoothDevicesDiscovery'
  ),
  startBluetoothDevicesDiscovery: _.mockAsyncAndPromise(
    'startBluetoothDevicesDiscovery'
  ),
  openBluetoothAdapter: _.mockAsyncAndPromise('openBluetoothAdapter'),
  onBluetoothDeviceFound() {},
  onBluetoothAdapterStateChange() {},
  offBluetoothDeviceFound() {},
  offBluetoothAdapterStateChange() {},
  makeBluetoothPair: _.mockAsyncAndPromise('makeBluetoothPair'),
  isBluetoothDevicePaired: _.mockAsyncAndPromise('isBluetoothDevicePaired'),
  getConnectedBluetoothDevices: _.mockAsyncAndPromise(
    'getConnectedBluetoothDevices',
    {devices: []}
  ),
  getBluetoothDevices: _.mockAsyncAndPromise('getBluetoothDevices', {
    devices: [],
  }),
  getBluetoothAdapterState: _.mockAsyncAndPromise('getBluetoothAdapterState', {
    discovering: true,
    available: true,
  }),
  closeBluetoothAdapter: _.mockAsyncAndPromise('closeBluetoothAdapter'),

  // 设备 - 蓝牙 - 低功耗中心设备
  writeBLECharacteristicValue: _.mockAsyncAndPromise(
    'writeBLECharacteristicValue'
  ),
  setBLEMTU: _.mockAsyncAndPromise('setBLEMTU', {mtu: 0}),
  readBLECharacteristicValue: _.mockAsyncAndPromise(
    'readBLECharacteristicValue'
  ),
  onBLEMTUChange() {},
  onBLEConnectionStateChange() {},
  onBLECharacteristicValueChange() {},
  offBLEMTUChange() {},
  offBLEConnectionStateChange() {},
  offBLECharacteristicValueChange() {},
  notifyBLECharacteristicValueChange: _.mockAsyncAndPromise(
    'notifyBLECharacteristicValueChange'
  ),
  getBLEMTU: _.mockAsyncAndPromise('getBLEMTU', {mtu: 0}),
  getBLEDeviceServices: _.mockAsyncAndPromise('getBLEDeviceServices', {
    services: [],
  }),
  getBLEDeviceRSSI: _.mockAsyncAndPromise('getBLEDeviceRSSI', {RSSI: 0}),
  getBLEDeviceCharacteristics: _.mockAsyncAndPromise(
    'getBLEDeviceCharacteristics',
    {characteristics: []}
  ),
  createBLEConnection: _.mockAsyncAndPromise('createBLEConnection'),
  closeBLEConnection: _.mockAsyncAndPromise('closeBLEConnection'),

  // 设备 - 蓝牙 - 低功耗外围设备
  onBLEPeripheralConnectionStateChanged() {},
  offBLEPeripheralConnectionStateChanged() {},
  createBLEPeripheralServer: _.mockAsyncAndPromise(
    'createBLEPeripheralServer',
    {
      server: {
        addService: _.mockAsync('addService'),
        close: _.mockAsync('close'),
        removeService: _.mockAsync('removeService'),
        startAdvertising: _.mockAsync('startAdvertising'),
        stopAdvertising: _.mockAsync('stopAdvertising'),
        writeCharacteristicValue: _.mockAsync('writeCharacteristicValue'),
        onCharacteristicWriteRequest() {},
        offCharacteristicWriteRequest() {},
        onCharacteristicReadRequest() {},
        offCharacteristicReadRequest() {},
        onCharacteristicSubscribed() {},
        offCharacteristicSubscribed() {},
        onCharacteristicUnsubscribed() {},
        offCharacteristicUnsubscribed() {},
      },
    }
  ),

  // 设备 - 蓝牙 - 信标(Beacon)
  stopBeaconDiscovery: _.mockAsyncAndPromise('stopBeaconDiscovery'),
  startBeaconDiscovery: _.mockAsyncAndPromise('startBeaconDiscovery'),
  onBeaconUpdate() {},
  onBeaconServiceChange() {},
  offBeaconUpdate() {},
  offBeaconServiceChange() {},
  getBeacons: _.mockAsyncAndPromise('getBeacons', {beacons: []}),

  // 设备 - NFC 读写
  getNFCAdapter: _.mockSync({
    startDiscovery: _.mockAsync('startDiscovery'),
    stopDiscovery: _.mockAsync('stopDiscovery'),
    getNdef: _.mockSync(undefined),
    getNfcA: _.mockSync(undefined),
    getNfcB: _.mockSync(undefined),
    getIsoDep: _.mockSync(undefined),
    getNfcF: _.mockSync(undefined),
    getNfcV: _.mockSync(undefined),
    getMifareClassic: _.mockSync(undefined),
    getMifareUltralight: _.mockSync(undefined),
    onDiscovered() {},
    offDiscovered() {},
  }),

  // 设备 - Wi-Fi
  stopWifi: _.mockAsyncAndPromise('stopWifi'),
  startWifi: _.mockAsyncAndPromise('startWifi'),
  setWifiList: _.mockAsyncAndPromise('setWifiList'),
  onWifiConnectedWithPartialInfo() {},
  onWifiConnected() {},
  onGetWifiList() {},
  offWifiConnectedWithPartialInfo() {},
  offWifiConnected() {},
  offGetWifiList() {},
  getWifiList: _.mockAsyncAndPromise('getWifiList'),
  getConnectedWifi: _.mockAsyncAndPromise('getConnectedWifi', {
    wifi: {
      SSID: '',
      BSSID: '',
      secure: false,
      signalStrength: 0,
      frequency: 0,
    },
  }),
  connectWifi: _.mockAsyncAndPromise('connectWifi'),

  // 设备 - 日历
  addPhoneRepeatCalendar: _.mockAsyncAndPromise('addPhoneRepeatCalendar'),
  addPhoneCalendar: _.mockAsyncAndPromise('addPhoneCalendar'),

  // 设备 - 联系人
  chooseContact: _.mockAsync('chooseContact', {
    phoneNumber: '123456789',
    displayName: 'june',
  }),
  addPhoneContact: _.mockAsyncAndPromise('addPhoneContact'),

  // 设备 - 无障碍
  checkIsOpenAccessibility: _.mockAsyncAndPromise('checkIsOpenAccessibility', {
    open: true,
  }),

  // 设备 - 电量
  getBatteryInfoSync: _.mockSync({
    level: 100,
    isCharging: false,
  }),
  getBatteryInfo: _.mockAsyncAndPromise('getBatteryInfo', {
    level: 100,
    isCharging: false,
  }),

  // 设备 - 剪贴板
  setClipboardData: _.mockAsyncAndPromise('setClipboardData'),
  getClipboardData: _.mockAsyncAndPromise('getClipboardData', {data: ''}),

  // 设备 - NFC
  stopHCE: _.mockAsyncAndPromise('stopHCE'),
  startHCE: _.mockAsyncAndPromise('startHCE'),
  sendHCEMessage: _.mockAsyncAndPromise('sendHCEMessage'),
  onHCEMessage() {},
  offHCEMessage() {},
  getHCEState: _.mockAsyncAndPromise('getHCEState'),

  // 设备 - 网络
  onNetworkWeakChange() {},
  onNetworkStatusChange() {},
  offNetworkWeakChange() {},
  offNetworkStatusChange() {},
  getNetworkType: _.mockAsyncAndPromise('getNetworkType', {
    networkType: 'wifi',
    signalStrength: 0,
    hasSystemProxy: false,
  }),
  getLocalIPAddress: _.mockAsync('getLocalIPAddress', {
    localip: '192.168.0.1',
    netmask: '255.255.255.0',
  }),

  // 设备 - 加密
  getRandomValues: userCryptoManager.getRandomValues,

  // 设备 - 屏幕
  setVisualEffectOnCapture: _.mockAsync('setVisualEffectOnCapture'),
  setScreenBrightness: _.mockAsyncAndPromise('setScreenBrightness'),
  setKeepScreenOn: _.mockAsyncAndPromise('setKeepScreenOn'),
  onUserCaptureScreen() {},
  onScreenRecordingStateChanged() {},
  offUserCaptureScreen() {},
  offScreenRecordingStateChanged() {},
  getScreenRecordingState: _.mockAsync('getScreenRecordingState', {
    state: 'off',
  }),
  getScreenBrightness: _.mockAsyncAndPromise('getScreenBrightness', {
    value: 0,
  }),

  // 设备 - 键盘
  onKeyboardHeightChange() {},
  offKeyboardHeightChange() {},
  hideKeyboard: _.mockAsyncAndPromise('hideKeyboard'),
  getSelectedTextRange: _.mockAsyncAndPromise('getSelectedTextRange', {
    start: 0,
    end: 0,
  }),

  // 设备 - 电话
  makePhoneCall: _.mockAsyncAndPromise('makePhoneCall'),

  // 设备 - 加速计
  stopAccelerometer: _.mockAsyncAndPromise('stopAccelerometer'),
  startAccelerometer: _.mockAsyncAndPromise('startAccelerometer'),
  onAccelerometerChange() {},
  offAccelerometerChange() {},

  // 设备 - 罗盘
  stopCompass: _.mockAsyncAndPromise('stopCompass'),
  startCompass: _.mockAsyncAndPromise('startCompass'),
  onCompassChange() {},
  offCompassChange() {},

  // 设备 - 设备方向
  stopDeviceMotionListening: _.mockAsyncAndPromise('stopDeviceMotionListening'),
  startDeviceMotionListening: _.mockAsyncAndPromise(
    'startDeviceMotionListening'
  ),
  onDeviceMotionChange() {},
  offDeviceMotionChange() {},

  // 设备 - 陀螺仪
  stopGyroscope: _.mockAsyncAndPromise('stopGyroscope'),
  startGyroscope: _.mockAsyncAndPromise('startGyroscope'),
  onGyroscopeChange() {},
  offGyroscopeChange() {},

  // 设备 - 内存
  onMemoryWarning() {},
  offMemoryWarning() {},

  // 设备 - 扫码
  scanCode: _.mockAsyncAndPromise('scanCode', {
    result: '',
    scanType: 'QR_CODE',
    charSet: 'utf8',
    path: '/',
    rawData: '',
  }),

  // 设备 - 短信
  sendSms: _.mockAsync('sendSms'),

  // 设备 - 振动
  vibrateShort: _.mockAsyncAndPromise('vibrateShort'),
  vibrateLong: _.mockAsyncAndPromise('vibrateLong'),

  // AI - AI 推理
  getInferenceEnvInfo: _.mockAsync('getInferenceEnvInfo', {ver: ''}),
  createInferenceSession: _.mockSync({
    onLoad() {},
    offLoad() {},
    onError() {},
    offError() {},
    run: () => new Promise(resolve => resolve({})),
    destroy() {},
  }),

  // AI - 视觉算法
  isVKSupport: _.mockSync(false),
  createVKSession: _.mockSync({
    state: 0,
    config: {
      version: 'v2',
      track: {
        plane: {mode: 3},
        marker: false,
        OSD: false,
        face: {mode: 1},
        OCR: {mode: 1},
        body: {mode: 1},
        hand: {mode: 1},
        threeDof: false,
      },
      gl: undefined,
    },
    cameraSize: {
      width: 414,
      height: 672,
    },

    start() {},
    stop() {},
    destroy() {},
    requestAnimationFrame: func => setTimeout(func, 0),
    cancelAnimationFrame: clearTimeout,
    getVKFrame: () => ({
      timestamp: 0,
      camera: {
        viewMatrix: Float32Array.from([]),
        intrinsics: Float32Array.from([]),
        getProjectionMatrix: () => Float32Array.from([]),
      },
      getCameraTexture: () => ({
        yTexture: undefined,
        uvTexture: undefined,
      }),
      getCameraBuffer: () => Uint8Array.from([]).buffer,
      getDisplayTransform: () => Float32Array.from([]),
    }),
    hitTest: () => [],
    addMarker: () => 0,
    removeMarker() {},
    getAllMarker: () => [],
    addOSDMarker: () => 0,
    removeOSDMarker() {},
    getAllOSDMarker: () => [],
    update3DMode() {},
    updateOSDThreshold() {},
    detectFace() {},
    detectBody() {},
    detectHand() {},
    runOCR() {},
    on() {},
    off() {},
  }),

  // AI - 人脸检测
  stopFaceDetect: _.mockAsync('stopFaceDetect'),
  initFaceDetect: _.mockAsync('initFaceDetect'),
  faceDetect: _.mockAsync('faceDetect', {
    detectRect: {
      height: 0, width: 0, originX: 0, originY: 0
    },
    x: -1,
    y: -1,
    pointArray: [],
    confArray: {
      global: 1, leftEye: 1, rightEye: 1, mouth: 1, nose: 1
    },
    angleArray: {pitch: 0, yaw: 0, roll: 0},
    faceInfo: [],
  }),

  // Worker
  createWorker: _.mockSync({
    postMessage() {},
    terminate() {},
    testOnProcessKilled() {},
    onMessage() {},
    onProcessKilled() {},
  }),

  // WXML
  createSelectorQuery: () => new SelectorQuery(),
  createIntersectionObserver: (compInst, options) => compInst.createIntersectionObserver(options),

  // 第三方平台
  getExtConfigSync: () => ({}),
  getExtConfig: _.mockAsyncAndPromise('getExtConfig', {extConfig: {}}),

  // 广告
  createRewardedVideoAd: () => ad,
  createInterstitialAd: () => ad,
}
