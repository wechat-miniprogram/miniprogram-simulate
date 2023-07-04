const wx = require('../../src/api/index')

const testSchema = (data, schema) => {
  const dataType = typeof data
  const schemaType = typeof schema

  if (schema === 'any') return true
  else if (
    schemaType === 'string' &&
    schema !== 'buffer' &&
    dataType !== schema
  ) {
    return false
  } else if (dataType === 'object') {
    const isDataArray = Array.isArray(data)
    const isSchemaArray = Array.isArray(schema)

    if (isDataArray !== isSchemaArray) {
      return false
    } else if (isDataArray) {
      const subSchema = schema[0]
      if (subSchema === 'any') return true
      else {
        for (const item of data) {
          if (!testSchema(item, subSchema)) return false
        }

        return true
      }
    } else if (schema === 'buffer') {
      return typeof data.byteLength !== 'undefined'
    } else {
      const schemaKeys = Object.keys(schema)
      for (const schemaKey of schemaKeys) {
        if (!testSchema(data[schemaKey], schema[schemaKey])) return false
      }

      return true
    }
  } else {
    return dataType === schema
  }
}
const testSync = (name, schema, ...args) => expect(testSchema(wx[name](...args), schema)).toBe(true)
const wrapAsync =
  func => (options = {}) => new Promise(resolve => func({...options, success: resolve}))
const testAsync = async(name, schema, ...args) => {
  const res = await wrapAsync(wx[name])(...args)
  expect(res).toHaveProperty('errMsg', `${name}:ok`)
  if (schema) expect(testSchema(res, schema)).toBe(true)
}
const testSubAsync = async(func, name, schema, ...args) => {
  const res = await wrapAsync(func)(...args)
  expect(res).toHaveProperty('errMsg', `${name}:ok`)
  if (schema) expect(testSchema(res, schema)).toBe(true)
}
const testAsyncAndPromise = async(name, schema, ...args) => {
  await testAsync(name, schema, ...args)
  expect(await wx[name](...args)).toHaveProperty('errMsg', `${name}:ok`)
}
const testOffscreenCanvas = offscreenCanvas => {
  testSchema(offscreenCanvas, {
    width: 'number',
    height: 'number',
  })
  expect(typeof offscreenCanvas.getContext()).toBe('object')
  expect(offscreenCanvas.createImage()).toBeInstanceOf(window.Image)
}

test('api', async() => {
  expect(typeof wx.env.USER_DATA_PATH).toBe('string')
  expect(typeof wx.canIUse()).toBe('boolean')
  expect(wx.base64ToArrayBuffer()).toHaveProperty('byteLength') // jest 里无法直接判断 ArrayBuffer 实例
  expect(typeof wx.arrayBufferToBase64()).toBe('string')

  await testAsyncAndPromise('openSystemBluetoothSetting')
  await testAsyncAndPromise('openAppAuthorizeSetting')
  testSync('getWindowInfo', {
    pixelRatio: 'number',
    screenWidth: 'number',
    screenHeight: 'number',
    windowWidth: 'number',
    windowHeight: 'number',
    statusBarHeight: 'number',
    safeArea: {
      left: 'number',
      right: 'number',
      top: 'number',
      bottom: 'number',
      width: 'number',
      height: 'number',
    },
    screenTop: 'number',
  })
  testSync('getSystemSetting', {
    bluetoothEnabled: 'boolean',
    deviceOrientation: 'string',
    locationEnabled: 'boolean',
    wifiEnabled: 'boolean',
  })
  const systemInfoSchema = {
    brand: 'string',
    model: 'string',
    pixelRatio: 'number',
    screenWidth: 'number',
    screenHeight: 'number',
    windowWidth: 'number',
    windowHeight: 'number',
    statusBarHeight: 'number',
    language: 'string',
    version: 'string',
    system: 'string',
    platform: 'string',
    fontSizeSetting: 'number',
    SDKVersion: 'string',
    benchmarkLevel: 'number',
    albumAuthorized: 'boolean',
    cameraAuthorized: 'boolean',
    locationAuthorized: 'boolean',
    microphoneAuthorized: 'boolean',
    notificationAuthorized: 'boolean',
    notificationAlertAuthorized: 'boolean',
    notificationBadgeAuthorized: 'boolean',
    notificationSoundAuthorized: 'boolean',
    phoneCalendarAuthorized: 'boolean',
    bluetoothEnabled: 'boolean',
    locationEnabled: 'boolean',
    wifiEnabled: 'boolean',
    safeArea: {
      left: 'number',
      right: 'number',
      top: 'number',
      bottom: 'number',
      width: 'number',
      height: 'number',
    },
    locationReducedAccuracy: 'boolean',
    theme: 'string',
    host: {env: 'string'},
    enableDebug: 'boolean',
    deviceOrientation: 'string',
  }
  testSync('getSystemInfoSync', systemInfoSchema)
  await testAsync('getSystemInfoAsync', systemInfoSchema)
  await testAsyncAndPromise('getSystemInfo', systemInfoSchema)
  const skylineInfoSchema = {
    isSupported: 'boolean',
    version: 'string',
    reason: 'string',
  }
  testSync('getSkylineInfoSync', skylineInfoSchema)
  await testAsync('getSkylineInfo', skylineInfoSchema)
  await testAsync('getRendererUserAgent', {userAgent: 'string'})
  expect(typeof (await wx.getRendererUserAgent())).toBe('string')
  testSync('getDeviceInfo', {
    abi: 'string',
    deviceAbi: 'string',
    benchmarkLevel: 'number',
    brand: 'string',
    model: 'string',
    system: 'string',
    platform: 'string',
    cpuType: 'string',
    memorySize: 'string',
  })
  testSync('getAppBaseInfo', {
    SDKVersion: 'string',
    enableDebug: 'boolean',
    host: {env: 'string'},
    language: 'string',
    version: 'string',
    theme: 'string',
  })
  testSync('getAppAuthorizeSetting', {
    albumAuthorized: 'string',
    bluetoothAuthorized: 'string',
    cameraAuthorized: 'string',
    locationAuthorized: 'string',
    locationReducedAccuracy: 'boolean',
    microphoneAuthorized: 'string',
    notificationAuthorized: 'string',
    notificationAlertAuthorized: 'string',
    notificationBadgeAuthorized: 'string',
    notificationSoundAuthorized: 'string',
    phoneCalendarAuthorized: 'string',
  })

  await testAsyncAndPromise('updateWeChatApp')
  const updateManager = wx.getUpdateManager()
  expect(typeof updateManager.applyUpdate).toBe('function')
  expect(typeof updateManager.onCheckForUpdate).toBe('function')
  expect(typeof updateManager.onUpdateFailed).toBe('function')
  expect(typeof updateManager.onUpdateReady).toBe('function')

  const launchOptionsSchema = {
    path: 'string',
    scene: 'number',
    query: {},
    shareTicket: 'string',
    referrerInfo: {},
    forwardMaterials: [
      {
        type: 'string',
        name: 'string',
        path: 'string',
        size: 'number',
      },
    ],
    chatType: 'number',
    apiCategory: 'string',
  }
  testSync('getLaunchOptionsSync', launchOptionsSchema)
  testSync('getEnterOptionsSync', launchOptionsSchema)

  expect(typeof wx.onUnhandledRejection).toBe('function')
  expect(typeof wx.onThemeChange).toBe('function')
  expect(typeof wx.onPageNotFound).toBe('function')
  expect(typeof wx.onLazyLoadError).toBe('function')
  expect(typeof wx.onError).toBe('function')
  expect(typeof wx.onAudioInterruptionEnd).toBe('function')
  expect(typeof wx.onAudioInterruptionBegin).toBe('function')
  expect(typeof wx.onAppShow).toBe('function')
  expect(typeof wx.onAppHide).toBe('function')
  expect(typeof wx.offUnhandledRejection).toBe('function')
  expect(typeof wx.offThemeChange).toBe('function')
  expect(typeof wx.offPageNotFound).toBe('function')
  expect(typeof wx.offLazyLoadError).toBe('function')
  expect(typeof wx.offError).toBe('function')
  expect(typeof wx.offAudioInterruptionEnd).toBe('function')
  expect(typeof wx.offAudioInterruptionBegin).toBe('function')
  expect(typeof wx.offAppShow).toBe('function')
  expect(typeof wx.offAppHide).toBe('function')

  await testAsyncAndPromise('setEnableDebug')
  const realtimeLogManager = wx.getRealtimeLogManager()
  expect(typeof realtimeLogManager.addFilterMsg).toBe('function')
  expect(typeof realtimeLogManager.error).toBe('function')
  expect(
    testSchema(realtimeLogManager.getCurrentState(), {
      size: 'number',
      maxSize: 'number',
      logCount: 'number',
      maxLogCount: 'number',
    })
  ).toBe(true)
  expect(typeof realtimeLogManager.in).toBe('function')
  expect(typeof realtimeLogManager.info).toBe('function')
  expect(typeof realtimeLogManager.setFilterMsg).toBe('function')
  const realtimeTagLogManager = realtimeLogManager.tag()
  expect(typeof realtimeTagLogManager.addFilterMsg).toBe('function')
  expect(typeof realtimeTagLogManager.error).toBe('function')
  expect(typeof realtimeTagLogManager.info).toBe('function')
  expect(typeof realtimeTagLogManager.setFilterMsg).toBe('function')
  expect(typeof realtimeTagLogManager.warn).toBe('function')
  expect(typeof realtimeLogManager.warn).toBe('function')
  const logManager = wx.getLogManager()
  expect(typeof logManager.debug).toBe('function')
  expect(typeof logManager.info).toBe('function')
  expect(typeof logManager.log).toBe('function')
  expect(typeof logManager.warn).toBe('function')

  expect(typeof wx.reportPerformance).toBe('function')
  await testAsync('preloadWebview')
  await testAsync('preloadSkylineView')
  await testAsync('preloadAssets')
  const performance = wx.getPerformance()
  const performanceObserver = performance.createObserver()
  expect(typeof performanceObserver.disconnect).toBe('function')
  expect(typeof performanceObserver.observe).toBe('function')
  const entrySchema = [
    {
      entryType: 'string',
      name: 'string',
      startTime: 'number',
    },
  ]
  expect(testSchema(performance.getEntries(), entrySchema)).toBe(true)
  expect(testSchema(performance.getEntriesByName(), entrySchema)).toBe(true)
  expect(testSchema(performance.getEntriesByType(), entrySchema)).toBe(true)
  expect(typeof performance.setBufferSize).toBe('function')

  const preDownloadSubpackageTask = wx.preDownloadSubpackage()
  expect(
    testSchema(
      await new Promise(resolve => preDownloadSubpackageTask.onProgressUpdate(resolve)),
      {
        progress: 'number',
        totalBytesWritten: 'number',
        totalBytesExpectedToWrite: 'number',
      }
    )
  ).toBe(true)
  const userCryptoManager = wx.getUserCryptoManager()
  await testSubAsync(userCryptoManager.getLatestUserKey, 'getLatestUserKey', {
    encryptKey: 'string',
    expireTime: 'number',
    iv: 'string',
    version: 'number',
  })
  await testSubAsync(
    userCryptoManager.getRandomValues,
    'getRandomValues',
    {
      randomValues: 'buffer',
    },
    {length: 1}
  )

  await testAsyncAndPromise('switchTab')
  await testAsyncAndPromise('reLaunch')
  await testAsyncAndPromise('redirectTo')
  await testAsyncAndPromise('navigateTo', {
    eventChannel: {
      emit: 'function',
      off: 'function',
      on: 'function',
      once: 'function',
    },
  })
  await testAsyncAndPromise('navigateBack')

  expect(typeof wx.router.addRouteBuilder).toBe('function')
  expect(wx.router.getRouteContext()).toBe(null)
  expect(typeof wx.router.removeRouteBuilder).toBe('function')

  await testAsyncAndPromise('openEmbeddedMiniProgram')
  await testAsyncAndPromise('navigateToMiniProgram')
  await testAsyncAndPromise('navigateBackMiniProgram')
  await testAsyncAndPromise('exitMiniProgram')

  await testAsyncAndPromise('updateShareMenu')
  await testAsyncAndPromise('showShareMenu')
  await testAsyncAndPromise('showShareImageMenu')
  await testAsyncAndPromise('shareVideoMessage')
  await testAsyncAndPromise('shareFileMessage')
  expect(typeof wx.onCopyUrl).toBe('function')
  expect(typeof wx.offCopyUrl).toBe('function')
  await testAsyncAndPromise('hideShareMenu')
  await testAsync('getShareInfo', {
    encryptedData: 'string',
    iv: 'string',
    cloudID: 'string',
  })
  await testAsync('authPrivateMessage', {
    valid: 'boolean',
    encryptedData: 'string',
    iv: 'string',
  })

  await testAsyncAndPromise('showToast')
  await testAsyncAndPromise('showModal', {
    content: 'string',
    confirm: 'boolean',
    cancel: 'boolean',
  })
  await testAsyncAndPromise('showLoading')
  await testAsyncAndPromise('showActionSheet')
  await testAsyncAndPromise('hideToast')
  await testAsyncAndPromise('hideLoading')
  await testAsync('enableAlertBeforeUnload')
  await testAsync('disableAlertBeforeUnload')

  await testAsyncAndPromise('showNavigationBarLoading')
  await testAsyncAndPromise('setNavigationBarTitle')
  await testAsyncAndPromise('setNavigationBarColor')
  await testAsyncAndPromise('hideNavigationBarLoading')
  await testAsyncAndPromise('hideHomeButton')

  await testAsyncAndPromise('setBackgroundTextStyle')
  await testAsyncAndPromise('setBackgroundColor')

  await testAsyncAndPromise('showTabBarRedDot')
  await testAsyncAndPromise('showTabBar')
  await testAsyncAndPromise('setTabBarStyle')
  await testAsyncAndPromise('setTabBarItem')
  await testAsyncAndPromise('setTabBarBadge')
  await testAsyncAndPromise('removeTabBarBadge')
  await testAsyncAndPromise('hideTabBarRedDot')
  await testAsyncAndPromise('hideTabBar')

  await testAsyncAndPromise('loadFontFace', {status: 'string'})

  await testAsyncAndPromise('stopPullDownRefresh')
  await testAsyncAndPromise('startPullDownRefresh')

  await testAsyncAndPromise('pageScrollTo')

  testSchema(wx.createAnimation(), {
    export: 'function',
    step: 'function',
    matrix: 'function',
    matrix3d: 'function',
    rotate: 'function',
    rotate3d: 'function',
    rotateX: 'function',
    rotateY: 'function',
    rotateZ: 'function',
    scale: 'function',
    scale3d: 'function',
    scaleX: 'function',
    scaleY: 'function',
    scaleZ: 'function',
    skew: 'function',
    skewX: 'function',
    skewY: 'function',
    translate: 'function',
    translate3d: 'function',
    translateX: 'function',
    translateY: 'function',
    translateZ: 'function',
    opacity: 'function',
    backgroundColor: 'function',
    width: 'function',
    height: 'function',
    left: 'function',
    right: 'function',
    top: 'function',
    bottom: 'function',
  })

  await testAsyncAndPromise('setTopBarText')

  let testNextTick = 1
  expect(testNextTick).toBe(1)
  await new Promise(resolve => wx.nextTick(() => {
    testNextTick = 2
    resolve()
  }))
  expect(testNextTick).toBe(2)

  testSync('getMenuButtonBoundingClientRect', {
    width: 'number',
    height: 'number',
    top: 'number',
    right: 'number',
    bottom: 'number',
    left: 'number',
  })

  await testAsync('setWindowSize')
  expect(typeof wx.onWindowResize).toBe('function')
  expect(typeof wx.offWindowResize).toBe('function')
  testSync('checkIsPictureInPictureActive', 'boolean')

  expect(typeof wx.worklet.cancelAnimation).toBe('function')
  expect(wx.worklet.derived(() => 88)).toEqual({value: 88})
  expect(wx.worklet.shared(88)).toEqual({value: 88})
  expect(
    wx.worklet.decay({
      clamp: [88],
    })
  ).toBe(88)
  expect(wx.worklet.decay()).toBe(0)
  testSchema(wx.worklet.Easing, {
    bounce: 'function',
    ease: 'function',
    elastic: 'function',
    linear: 'function',
    quad: 'function',
    cubic: 'function',
    poly: 'function',
    bezier: 'function',
    circle: 'function',
    sin: 'function',
    exp: 'function',
    in: 'function',
    out: 'function',
    inOut: 'function',
  })
  expect(wx.worklet.spring(88)).toBe(88)
  expect(
    await new Promise(resolve => {
      wx.worklet.spring(88, {}, resolve)
    })
  ).toBe(false)
  expect(wx.worklet.timing(88)).toBe(88)
  expect(
    await new Promise(resolve => {
      wx.worklet.timing(88, {}, resolve)
    })
  ).toBe(false)
  expect(wx.worklet.delay(100, 88)).toBe(88)
  expect(wx.worklet.repeat(88)).toBe(88)
  expect(
    await new Promise(resolve => {
      wx.worklet.repeat(88, {}, true, resolve)
    })
  ).toBe(false)
  expect(wx.worklet.sequence(88)).toBe(88)
  const workletFunc = () => {}
  expect(wx.worklet.runOnJS(workletFunc)).toBe(workletFunc)
  expect(wx.worklet.runOnUI(workletFunc)).toBe(workletFunc)

  await testAsync('request', {
    data: 'any',
    statusCode: 'number',
    header: {},
    cookies: [],
    profile: {},
  })
  const requestTask = wx.request()
  testSchema(requestTask, {
    abort: 'function',
    offChunkReceived: 'function',
    offHeadersReceived: 'function',
    onChunkReceived: 'function',
    onHeadersReceived: 'function',
  })

  await testAsync('downloadFile', {
    tempFilePath: 'string',
    filePath: 'string',
    statusCode: 'number',
    profile: {},
  })
  const downloadFileTask = wx.downloadFile()
  testSchema(downloadFileTask, {
    abort: 'function',
    offChunkReceived: 'function',
    offHeadersReceived: 'function',
    onChunkReceived: 'function',
    onHeadersReceived: 'function',
  })

  await testAsync('uploadFile', {
    data: 'any',
    statusCode: 'number',
  })
  const uploadFileTask = wx.uploadFile()
  testSchema(uploadFileTask, {
    abort: 'function',
    offChunkReceived: 'function',
    offHeadersReceived: 'function',
    onChunkReceived: 'function',
    onHeadersReceived: 'function',
  })

  await testAsyncAndPromise('sendSocketMessage')
  expect(typeof wx.onSocketOpen).toBe('function')
  expect(typeof wx.onSocketMessage).toBe('function')
  expect(typeof wx.onSocketError).toBe('function')
  expect(typeof wx.onSocketClose).toBe('function')
  await testAsync('connectSocket')
  const socket = wx.connectSocket()
  testSchema(socket, {
    send: 'function',
    close: 'function',
    onOpen: 'function',
    onClose: 'function',
    onError: 'function',
    onMessage: 'function',
  })
  await testAsync('closeSocket')

  await testAsyncAndPromise('stopLocalServiceDiscovery')
  await testAsyncAndPromise('startLocalServiceDiscovery')
  expect(typeof wx.onLocalServiceResolveFail).toBe('function')
  expect(typeof wx.onLocalServiceLost).toBe('function')
  expect(typeof wx.onLocalServiceFound).toBe('function')
  expect(typeof wx.onLocalServiceDiscoveryStop).toBe('function')
  expect(typeof wx.offLocalServiceResolveFail).toBe('function')
  expect(typeof wx.offLocalServiceLost).toBe('function')
  expect(typeof wx.offLocalServiceFound).toBe('function')
  expect(typeof wx.offLocalServiceDiscoveryStop).toBe('function')

  const tcpSocket = wx.createTCPSocket()
  testSchema(tcpSocket, {
    connect: 'function',
    write: 'function',
    close: 'function',
    onClose: 'function',
    offClose: 'function',
    onError: 'function',
    offError: 'function',
    onMessage: 'function',
    offMessage: 'function',

    bindWifi: 'function',
    onConnect: 'function',
    offConnect: 'function',
    onBindWifi: 'function',
    offBindWifi: 'function',
  })

  const udpSocket = wx.createUDPSocket()
  testSchema(udpSocket, {
    connect: 'function',
    write: 'function',
    close: 'function',
    onClose: 'function',
    offClose: 'function',
    onError: 'function',
    offError: 'function',
    onMessage: 'function',
    offMessage: 'function',

    setTTL: 'function',
    send: 'function',
    onListening: 'function',
    offListening: 'function',
  })
  expect(udpSocket.bind(88)).toBe(88)

  await testAsync('requestPluginPayment')
  await testAsyncAndPromise('requestPayment')

  expect(typeof wx.setStorageSync).toBe('function')
  await testAsync('setStorage')
  expect(typeof wx.revokeBufferURL).toBe('function')
  expect(typeof wx.removeStorageSync).toBe('function')
  await testAsync('removeStorage')
  testSync('getStorageSync', 'string')
  testSync('getStorageInfoSync', {
    currentSize: 'number',
    keys: ['string'],
    limitSize: 'number',
  })
  await testAsync('getStorageInfo', {
    currentSize: 'number',
    keys: ['string'],
    limitSize: 'number',
  })
  await testAsync('getStorage', {data: 'any'})
  testSync('createBufferURL', 'string')
  expect(typeof wx.clearStorageSync).toBe('function')
  await testAsync('clearStorage')
  expect(typeof wx.batchSetStorageSync).toBe('function')
  await testAsync('batchSetStorage')
  testSync('batchGetStorageSync', ['any'])
  await testAsync('batchGetStorage', {dataList: ['any']})

  await testAsyncAndPromise('setBackgroundFetchToken')
  expect(typeof wx.onBackgroundFetchData).toBe('function')
  await testAsyncAndPromise('getBackgroundFetchToken', {token: 'string'})
  await testAsyncAndPromise('getBackgroundFetchData', {
    fetchedData: 'string',
    timeStamp: 'number',
    path: 'string',
    query: 'string',
    scene: 'number',
  })

  const cacheManager = wx.createCacheManager()
  testSchema(cacheManager, {
    mode: 'string',
    origin: 'string',
    maxAge: 'number',
    state: 'number',
    deleteRules: 'function',
    deleteRule: 'function',
    clearRules: 'function',
    on: 'function',
    off: 'function',
    start: 'function',
    stop: 'function',
    deleteCaches: 'function',
    deleteCache: 'function',
    clearCaches: 'function',
  })
  testSchema(cacheManager.addRules(), ['string'])
  testSchema(cacheManager.addRule(), 'string')
  testSchema(cacheManager.match(), {})

  expect(typeof wx.reportMonitor).toBe('function')
  expect(typeof wx.reportEvent).toBe('function')
  expect(typeof wx.reportAnalytics).toBe('function')
  testSync('getExptInfoSync', {})

  // XR-FRAME
  // 暂不考虑支持

  testOffscreenCanvas(wx.createOffscreenCanvas())
  const canvasContext = wx.createCanvasContext()
  testSchema(canvasContext, {
    fillStyle: 'string',
    strokeStyle: 'string',
    shadowOffsetX: 'number',
    shadowOffsetY: 'number',
    shadowColor: 'number',
    shadowBlur: 'number',
    lineWidth: 'number',
    lineCap: 'string',
    lineJoin: 'string',
    lineDashOffset: 'number',
    font: 'string',
    globalAlpha: 'number',
    globalCompositeOperation: 'string',
    arc: 'function',
    arcTo: 'function',
    beginPath: 'function',
    bezierCurveTo: 'function',
    clearRect: 'function',
    clip: 'function',
    closePath: 'function',
    createPattern: 'function',
    draw: 'function',
    drawImage: 'function',
    fill: 'function',
    fillRect: 'function',
    fillText: 'function',
    lineTo: 'function',
    moveTo: 'function',
    quadraticCurveTo: 'function',
    rect: 'function',
    restore: 'function',
    rotate: 'function',
    save: 'function',
    scale: 'function',
    setFillStyle: 'function',
    setFontSize: 'function',
    setGlobalAlpha: 'function',
    setLineCap: 'function',
    setLineDash: 'function',
    setLineJoin: 'function',
    setLineWidth: 'function',
    setMiterLimit: 'function',
    setShadow: 'function',
    setStrokeStyle: 'function',
    setTextAlign: 'function',
    setTextBaseline: 'function',
    setTransform: 'function',
    stroke: 'function',
    strokeRect: 'function',
    strokeText: 'function',
    transform: 'function',
    translate: 'function',
  })
  expect(
    testSchema(canvasContext.createCircularGradient(), {
      addColorStop: 'function',
    })
  ).toBe(true)
  expect(
    testSchema(canvasContext.createLinearGradient(), {
      addColorStop: 'function',
    })
  ).toBe(true)
  expect(testSchema(canvasContext.measureText(), {width: 'number'})).toBe(
    true
  )
  await testAsyncAndPromise('canvasToTempFilePath', {tempFilePath: 'string'})
  await testAsyncAndPromise('canvasPutImageData')
  await testAsyncAndPromise('canvasGetImageData', {
    width: 'number',
    height: 'number',
    data: 'buffer',
  })

  const mapContext = wx.createMapContext()
  await testSubAsync(mapContext.addArc, 'addArc')
  await testSubAsync(mapContext.addCustomLayer, 'addCustomLayer')
  await testSubAsync(mapContext.addGroundOverlay, 'addGroundOverlay')
  await testSubAsync(mapContext.addMarkers, 'addMarkers')
  await testSubAsync(mapContext.addVisualLayer, 'addVisualLayer')
  await testSubAsync(mapContext.eraseLines, 'eraseLines')
  await testSubAsync(
    mapContext.executeVisualLayerCommand,
    'executeVisualLayerCommand',
    {data: 'string'}
  )
  await testSubAsync(mapContext.fromScreenLocation, 'fromScreenLocation', {
    latitude: 'number',
    longitude: 'number',
  })
  await testSubAsync(mapContext.getCenterLocation, 'getCenterLocation', {
    latitude: 'number',
    longitude: 'number',
  })
  await testSubAsync(mapContext.getRegion, 'getRegion', {
    southwest: {
      latitude: 'number',
      longitude: 'number',
    },
    northeast: {
      latitude: 'number',
      longitude: 'number',
    },
  })
  await testSubAsync(mapContext.getRotate, 'getRotate', {rotate: 'number'})
  await testSubAsync(mapContext.getScale, 'getScale', {scale: 'number'})
  await testSubAsync(mapContext.getSkew, 'getSkew', {scale: 'number'})
  await testSubAsync(mapContext.includePoints, 'includePoints')
  await testSubAsync(mapContext.initMarkerCluster, 'initMarkerCluster')
  await testSubAsync(mapContext.moveAlong, 'moveAlong')
  await testSubAsync(mapContext.moveToLocation, 'moveToLocation')
  expect(typeof mapContext.on).toBe('function')
  await testSubAsync(mapContext.openMapApp, 'openMapApp')
  await testSubAsync(mapContext.removeArc, 'removeArc')
  await testSubAsync(mapContext.removeCustomLayer, 'removeCustomLayer')
  await testSubAsync(mapContext.removeGroundOverlay, 'removeGroundOverlay')
  await testSubAsync(mapContext.removeMarkers, 'removeMarkers')
  await testSubAsync(mapContext.removeVisualLayer, 'removeVisualLayer')
  await testSubAsync(mapContext.setBoundary, 'setBoundary')
  await testSubAsync(mapContext.setCenterOffset, 'setCenterOffset')
  await testSubAsync(mapContext.setLocMarkerIcon, 'setLocMarkerIcon')
  await testSubAsync(mapContext.toScreenLocation, 'toScreenLocation', {
    x: 'number',
    y: 'number',
  })
  await testSubAsync(mapContext.translateMarker, 'translateMarker')
  await testSubAsync(mapContext.updateGroundOverlay, 'updateGroundOverlay')

  // 媒体 - 图片
  await testAsyncAndPromise('saveImageToPhotosAlbum')
  await testAsyncAndPromise('previewMedia')
  await testAsyncAndPromise('previewImage')
  await testAsyncAndPromise('getImageInfo', {
    width: 'number',
    height: 'number',
    path: 'string',
    orientation: 'string',
    type: 'string',
  })
  await testAsync('editImage', {tempFilePath: 'string'})
  await testAsync('cropImage', {tempFilePath: 'string'})
  await testAsyncAndPromise('compressImage', {tempFilePath: 'string'})
  await testAsyncAndPromise('chooseMessageFile', {
    tempFiles: [
      {
        path: 'string',
        size: 'number',
        name: 'string',
        type: 'string',
        time: 'number',
      },
    ],
  })
  await testAsyncAndPromise('chooseImage', {
    tempFilePaths: ['string'],
    tempFiles: [{path: 'string', size: 'number'}],
  })

  // 媒体 - 视频
  await testAsyncAndPromise('saveVideoToPhotosAlbum')
  await testAsync('openVideoEditor', {
    duration: 'number',
    size: 'number',
    tempFilePath: 'string',
    tempThumbPath: 'string',
  })
  await testAsyncAndPromise('getVideoInfo', {
    orientation: 'string',
    type: 'string',
    duration: 'number',
    size: 'number',
    height: 'number',
    width: 'number',
    fps: 'number',
    bitrate: 'number',
  })
  const videoContext = wx.createVideoContext()
  expect(typeof videoContext.exitBackgroundPlayback).toBe('function')
  expect(typeof videoContext.exitCasting).toBe('function')
  expect(typeof videoContext.exitFullScreen).toBe('function')
  await testSubAsync(videoContext.exitPictureInPicture, 'exitPictureInPicture')
  expect(typeof videoContext.hideStatusBar).toBe('function')
  expect(typeof videoContext.pause).toBe('function')
  expect(typeof videoContext.play).toBe('function')
  expect(typeof videoContext.playbackRate).toBe('function')
  expect(typeof videoContext.reconnectCasting).toBe('function')
  expect(typeof videoContext.requestBackgroundPlayback).toBe('function')
  expect(typeof videoContext.requestFullScreen).toBe('function')
  expect(typeof videoContext.seek).toBe('function')
  expect(typeof videoContext.sendDanmu).toBe('function')
  expect(typeof videoContext.showStatusBar).toBe('function')
  expect(typeof videoContext.startCasting).toBe('function')
  expect(typeof videoContext.stop).toBe('function')
  expect(typeof videoContext.switchCasting).toBe('function')
  await testAsyncAndPromise('compressVideo', {
    tempFilePath: 'string',
    size: 'number',
  })
  await testAsyncAndPromise('chooseVideo', {
    tempFilePath: 'string',
    duration: 'number',
    size: 'number',
    height: 'number',
    width: 'number',
  })
  await testAsyncAndPromise('chooseMedia', {
    tempFiles: [
      {
        tempFilePath: 'string',
        size: 'number',
        duration: 'number',
        height: 'number',
        width: 'number',
        thumbTempFilePath: 'string',
        fileType: 'string',
      },
    ],
    type: 'string',
  })

  await testAsyncAndPromise('stopVoice')
  await testAsyncAndPromise('setInnerAudioOption')
  await testAsyncAndPromise('playVoice')
  await testAsyncAndPromise('pauseVoice')
  await testAsyncAndPromise('getAvailableAudioSources', {
    audioSources: ['string'],
  })
  const webAudioContext = wx.createWebAudioContext()
  testSchema(webAudioContext, {
    state: 'string',
    onstatechange: 'function',
    currentTime: 'number',
    WebAudioContextNode: {
      positionX: 'number',
      positionY: 'number',
      positionZ: 'number',
      forwardX: 'number',
      forwardY: 'number',
      forwardZ: 'number',
      upX: 'number',
      upY: 'number',
      upZ: 'number',
      setOrientation: 'function',
      setPosition: 'function',
    },
    listener: 'function',
    sampleRate: 'number',
    createAnalyser: 'function',
    createBiquadFilter: 'function',
    createBufferSource: 'function',
    createChannelMerger: 'function',
    createChannelSplitter: 'function',
    createConstantSource: 'function',
    createDelay: 'function',
    createDynamicsCompressor: 'function',
    createGain: 'function',
    createIIRFilter: 'function',
    createOscillator: 'function',
    createPanner: 'function',
    createPeriodicWave: 'function',
    createScriptProcessor: 'function',
    createWaveShaper: 'function',
  })
  expect(webAudioContext.close()).toBeInstanceOf(Promise)
  const audioBufferSchema = {
    sampleRate: 'number',
    length: 'number',
    duration: 'number',
    numberOfChannels: 'number',
    copyFromChannel: 'function',
    copyToChannel: 'function',
    getChannelData: 'function',
  }
  expect(testSchema(webAudioContext.createBuffer(), audioBufferSchema)).toBe(
    true
  )
  expect(webAudioContext.createBuffer().getChannelData()).toHaveProperty(
    'byteLength'
  )
  expect(testSchema(webAudioContext.decodeAudioData(), audioBufferSchema)).toBe(
    true
  )
  expect(webAudioContext.decodeAudioData().getChannelData()).toHaveProperty(
    'byteLength'
  )
  expect(webAudioContext.resume()).toBeInstanceOf(Promise)
  expect(webAudioContext.suspend()).toBeInstanceOf(Promise)
  const mediaAudioPlayer = wx.createMediaAudioPlayer()
  testSchema(mediaAudioPlayer, {
    volume: 'number',
  })
  expect(mediaAudioPlayer.addAudioSource()).toBeInstanceOf(Promise)
  expect(mediaAudioPlayer.destroy()).toBeInstanceOf(Promise)
  expect(mediaAudioPlayer.removeAudioSource()).toBeInstanceOf(Promise)
  expect(mediaAudioPlayer.start()).toBeInstanceOf(Promise)
  expect(mediaAudioPlayer.stop()).toBeInstanceOf(Promise)
  const innerAudioContext = wx.createInnerAudioContext()
  testSchema(innerAudioContext, {
    src: 'string',
    startTime: 'number',
    autoplay: 'boolean',
    loop: 'boolean',
    obeyMuteSwitch: 'boolean',
    volume: 'number',
    playbackRate: 'number',
    duration: 'number',
    currentTime: 'number',
    paused: 'boolean',
    buffered: 'number',
    referrerPolicy: 'string',
    destroy: 'function',
    offCanplay: 'function',
    offEnded: 'function',
    offError: 'function',
    offPause: 'function',
    offPlay: 'function',
    offSeeked: 'function',
    offSeeking: 'function',
    offStop: 'function',
    offTimeUpdate: 'function',
    offWaiting: 'function',
    onCanplay: 'function',
    onEnded: 'function',
    onError: 'function',
    onPause: 'function',
    onPlay: 'function',
    onSeeked: 'function',
    onSeeking: 'function',
    onStop: 'function',
    onTimeUpdate: 'function',
    onWaiting: 'function',
    pause: 'function',
    play: 'function',
    seek: 'function',
    stop: 'function',
  })
  const audioContext = wx.createAudioContext()
  testSchema(audioContext, {
    pause: 'function',
    play: 'function',
    seek: 'function',
    setSrc: 'function',
  })

  await testAsyncAndPromise('stopBackgroundAudio')
  await testAsyncAndPromise('seekBackgroundAudio')
  await testAsyncAndPromise('playBackgroundAudio')
  await testAsyncAndPromise('pauseBackgroundAudio')
  expect(typeof wx.onBackgroundAudioStop).toBe('function')
  expect(typeof wx.onBackgroundAudioPlay).toBe('function')
  expect(typeof wx.onBackgroundAudioPause).toBe('function')
  await testAsyncAndPromise('getBackgroundAudioPlayerState', {
    duration: 'number',
    currentPosition: 'number',
    status: 'number',
    downloadPercent: 'number',
    dataUrl: 'string',
  })
  const backgroundAudioManager = wx.getBackgroundAudioManager()
  testSchema(backgroundAudioManager, {
    src: 'string',
    startTime: 'number',
    title: 'string',
    epname: 'string',
    singer: 'string',
    coverImgUrl: 'string',
    webUrl: 'string',
    protocol: 'string',
    playbackRate: 'number',
    duration: 'number',
    currentTime: 'number',
    paused: 'boolean',
    buffered: 'number',
    referrerPolicy: 'string',
    onCanplay: 'function',
    onEnded: 'function',
    onError: 'function',
    onNext: 'function',
    onPause: 'function',
    onPlay: 'function',
    onPrev: 'function',
    onSeeked: 'function',
    onSeeking: 'function',
    onStop: 'function',
    onTimeUpdate: 'function',
    onWaiting: 'function',
    pause: 'function',
    play: 'function',
    seek: 'function',
    stop: 'function',
  })

  const livePuhserContext = wx.createLivePusherContext()
  await testSubAsync(
    livePuhserContext.applyBlusherStickMakeup,
    'applyBlusherStickMakeup'
  )
  await testSubAsync(livePuhserContext.applyEyeBrowMakeup, 'applyEyeBrowMakeup')
  await testSubAsync(
    livePuhserContext.applyEyeShadowMakeup,
    'applyEyeShadowMakeup'
  )
  await testSubAsync(
    livePuhserContext.applyFaceContourMakeup,
    'applyFaceContourMakeup'
  )
  await testSubAsync(livePuhserContext.applyFilter, 'applyFilter')
  await testSubAsync(
    livePuhserContext.applyLipStickMakeup,
    'applyLipStickMakeup'
  )
  await testSubAsync(livePuhserContext.applySticker, 'applySticker')
  await testSubAsync(livePuhserContext.clearFilters, 'clearFilters')
  await testSubAsync(livePuhserContext.clearMakeups, 'clearMakeups')
  await testSubAsync(livePuhserContext.clearStickers, 'clearStickers')
  testOffscreenCanvas(livePuhserContext.createOffscreenCanvas())
  await testSubAsync(
    livePuhserContext.exitPictureInPicture,
    'exitPictureInPicture'
  )
  await testSubAsync(livePuhserContext.getMaxZoom, 'getMaxZoom', {
    maxZoom: 'string',
  })
  expect(typeof livePuhserContext.onCustomRendererEvent).toBe('function')
  await testSubAsync(livePuhserContext.pause, 'pause')
  await testSubAsync(livePuhserContext.pauseBGM, 'pauseBGM')
  await testSubAsync(livePuhserContext.playBGM, 'playBGM')
  await testSubAsync(livePuhserContext.resume, 'resume')
  await testSubAsync(livePuhserContext.resumeBGM, 'resumeBGM')
  await testSubAsync(livePuhserContext.sendMessage, 'sendMessage')
  await testSubAsync(livePuhserContext.setBGMVolume, 'setBGMVolume')
  await testSubAsync(livePuhserContext.setMICVolume, 'setMICVolume')
  await testSubAsync(livePuhserContext.setZoom, 'setZoom')
  await testSubAsync(livePuhserContext.snapshot, 'snapshot', {
    tempImagePath: 'string',
    width: 'number',
    height: 'number',
  })
  await testSubAsync(livePuhserContext.start, 'start')
  await testSubAsync(livePuhserContext.startPreview, 'startPreview')
  await testSubAsync(livePuhserContext.stop, 'stop')
  await testSubAsync(livePuhserContext.stopBGM, 'stopBGM')
  await testSubAsync(livePuhserContext.stopPreview, 'stopPreview')
  await testSubAsync(livePuhserContext.switchCamera, 'switchCamera')
  await testSubAsync(livePuhserContext.toggleTorch, 'toggleTorch')
  const livePlayerContext = wx.createLivePlayerContext()
  await testSubAsync(livePlayerContext.exitCasting, 'exitCasting')
  await testSubAsync(livePlayerContext.exitFullScreen, 'exitFullScreen')
  await testSubAsync(
    livePlayerContext.exitPictureInPicture,
    'exitPictureInPicture'
  )
  await testSubAsync(livePlayerContext.mute, 'mute')
  await testSubAsync(livePlayerContext.pause, 'pause')
  await testSubAsync(livePlayerContext.play, 'play')
  await testSubAsync(livePlayerContext.reconnectCasting, 'reconnectCasting')
  await testSubAsync(livePlayerContext.requestFullScreen, 'requestFullScreen')
  await testSubAsync(
    livePlayerContext.requestPictureInPicture,
    'requestPictureInPicture'
  )
  await testSubAsync(livePlayerContext.resume, 'resume')
  await testSubAsync(livePlayerContext.snapshot, 'snapshot', {
    tempImagePath: 'string',
    width: 'number',
    height: 'number',
  })
  await testSubAsync(livePlayerContext.startCasting, 'startCasting')
  await testSubAsync(livePlayerContext.stop, 'stop')
  await testSubAsync(livePlayerContext.switchCasting, 'switchCasting')

  await testAsyncAndPromise('stopRecord')
  await testAsyncAndPromise('startRecord', {tempFilePath: 'string'})
  const recorderManager = wx.getRecorderManager()
  testSchema(recorderManager, {
    onError: 'function',
    onFrameRecorded: 'function',
    onInterruptionBegin: 'function',
    onInterruptionEnd: 'function',
    onPause: 'function',
    onResume: 'function',
    onStart: 'function',
    onStop: 'function',
    pause: 'function',
    resume: 'function',
    start: 'function',
    stop: 'function',
  })

  const cameraContext = wx.createCameraContext()
  const cameraFrameListener = cameraContext.onCameraFrame()
  await testSubAsync(cameraFrameListener.start, 'start')
  await testSubAsync(cameraFrameListener.stop, 'stop')
  await testSubAsync(cameraContext.setZoom, 'setZoom', {zoom: 'number'})
  await testSubAsync(cameraContext.startRecord, 'startRecord', {
    tempThumbPath: 'string',
    tempVideoPath: 'string',
  })
  await testSubAsync(cameraContext.stopRecord, 'stopRecord', {
    tempThumbPath: 'string',
    tempVideoPath: 'string',
  })
  await testSubAsync(cameraContext.takePhoto, 'takePhoto', {
    tempImagePath: 'string',
  })

  const mediaContainer = wx.createMediaContainer()
  testSchema(mediaContainer, {
    addTrack: 'function',
    destroy: 'function',
    export: 'function',
    extractDataSource: 'function',
    removeTrack: 'function',
  })

  await testAsyncAndPromise('updateVoIPChatMuteConfig')
  await testAsyncAndPromise('subscribeVoIPVideoMembers')
  await testAsyncAndPromise('setEnable1v1Chat')
  expect(typeof wx.onVoIPVideoMembersChanged).toBe('function')
  expect(typeof wx.onVoIPChatStateChanged).toBe('function')
  expect(typeof wx.onVoIPChatSpeakersChanged).toBe('function')
  expect(typeof wx.onVoIPChatMembersChanged).toBe('function')
  expect(typeof wx.onVoIPChatInterrupted).toBe('function')
  expect(typeof wx.offVoIPVideoMembersChanged).toBe('function')
  expect(typeof wx.offVoIPChatStateChanged).toBe('function')
  expect(typeof wx.offVoIPChatSpeakersChanged).toBe('function')
  expect(typeof wx.offVoIPChatMembersChanged).toBe('function')
  expect(typeof wx.offVoIPChatInterrupted).toBe('function')
  await testAsyncAndPromise('joinVoIPChat', {openIdList: ['string']})
  await testAsyncAndPromise('join1v1Chat')
  await testAsyncAndPromise('exitVoIPChat')

  const mediaRecorder = wx.createMediaRecorder()
  testSchema(mediaRecorder, {
    off: 'function',
    on: 'function',
  })
  expect(mediaRecorder.destroy()).toBeInstanceOf(Promise)
  expect(mediaRecorder.pause()).toBeInstanceOf(Promise)
  expect(mediaRecorder.requestFrame()).toBeInstanceOf(Promise)
  expect(mediaRecorder.resume()).toBeInstanceOf(Promise)
  expect(mediaRecorder.start()).toBeInstanceOf(Promise)
  expect(mediaRecorder.stop()).toBeInstanceOf(Promise)

  const videoDecoder = wx.createVideoDecoder()
  testSchema(videoDecoder, {
    off: 'function',
    on: 'function',
  })
  testSchema(videoDecoder.getFrameData(), {
    width: 'number',
    height: 'number',
    data: 'buffer',
    pkPts: 'number',
    pkDts: 'number',
  })
  expect(videoDecoder.remove()).toBeInstanceOf(Promise)
  expect(videoDecoder.seek()).toBeInstanceOf(Promise)
  expect(videoDecoder.start()).toBeInstanceOf(Promise)
  expect(videoDecoder.stop()).toBeInstanceOf(Promise)

  await testAsyncAndPromise('stopLocationUpdate')
  await testAsyncAndPromise('startLocationUpdateBackground')
  await testAsyncAndPromise('startLocationUpdate')
  await testAsyncAndPromise('openLocation')
  expect(typeof wx.onLocationChangeError).toBe('function')
  expect(typeof wx.onLocationChange).toBe('function')
  expect(typeof wx.offLocationChangeError).toBe('function')
  expect(typeof wx.offLocationChange).toBe('function')
  await testAsyncAndPromise('getLocation', {
    latitude: 'number',
    longitude: 'number',
    speed: 'number',
    accuracy: 'number',
    altitude: 'number',
    verticalAccuracy: 'number',
    horizontalAccuracy: 'number',
  })
  await testAsync('getFuzzyLocation', {
    latitude: 'number',
    longitude: 'number',
  })
  await testAsyncAndPromise('choosePoi', {
    type: 'number',
    city: 'string',
    name: 'string',
    address: 'string',
    latitude: 'number',
    longitude: 'number',
  })
  await testAsyncAndPromise('chooseLocation', {
    name: 'string',
    address: 'string',
    latitude: 'number',
    longitude: 'number',
  })

  await testAsync('saveFileToDisk')
  await testAsyncAndPromise('openDocument')
  const fileSystemManager = wx.getFileSystemManager()
  await testSubAsync(fileSystemManager.access, 'access')
  expect(typeof fileSystemManager.accessSync).toBe('function')
  await testSubAsync(fileSystemManager.appendFile, 'appendFile')
  expect(typeof fileSystemManager.appendFileSync).toBe('function')
  await testSubAsync(fileSystemManager.close, 'close')
  expect(typeof fileSystemManager.closeSync).toBe('function')
  await testSubAsync(fileSystemManager.copyFile, 'copyFile')
  expect(typeof fileSystemManager.copyFileSync).toBe('function')
  await testSubAsync(fileSystemManager.fstat, 'fstat')
  const statsSchema = {
    mode: 'string',
    size: 'number',
    lastAccessedTime: 'number',
    lastModifiedTime: 'number',
    isDirectory: 'function',
    isFile: 'function',
  }
  expect(testSchema(fileSystemManager.fstatSync(), statsSchema)).toBe(true)
  await testSubAsync(fileSystemManager.ftruncate, 'ftruncate')
  expect(typeof fileSystemManager.ftruncateSync).toBe('function')
  await testSubAsync(fileSystemManager.getFileInfo, 'getFileInfo', {
    size: 'number',
  })
  await testSubAsync(fileSystemManager.getSavedFileList, 'getSavedFileList', {
    fileList: [{filePath: 'string', size: 'number'}],
  })
  await testSubAsync(fileSystemManager.mkdir, 'mkdir')
  expect(typeof fileSystemManager.mkdirSync).toBe('function')
  await testSubAsync(fileSystemManager.open, 'open', {fd: 'string'})
  expect(testSchema(fileSystemManager.openSync(), 'string')).toBe(true)
  await testSubAsync(fileSystemManager.read, 'read', {
    bytesRead: 'number',
    arrayBuffer: 'buffer',
  })
  await testSubAsync(
    fileSystemManager.readCompressedFile,
    'readCompressedFile',
    {
      data: 'buffer',
    }
  )
  expect(testSchema(fileSystemManager.readCompressedFileSync(), 'buffer')).toBe(
    true
  )
  await testSubAsync(fileSystemManager.readdir, 'readdir', {
    files: ['string'],
  })
  expect(testSchema(fileSystemManager.readdirSync(), ['string'])).toBe(true)
  await testSubAsync(fileSystemManager.readFile, 'readFile', {data: 'string'})
  expect(testSchema(fileSystemManager.readFileSync(), 'string')).toBe(true)
  expect(
    testSchema(fileSystemManager.readSync(), {
      bytesRead: 'number',
      arrayBuffer: 'buffer',
    })
  ).toBe(true)
  await testSubAsync(fileSystemManager.readZipEntry, 'readZipEntry', {
    entries: {},
  })
  await testSubAsync(fileSystemManager.removeSavedFile, 'removeSavedFile')
  await testSubAsync(fileSystemManager.rename, 'rename')
  expect(typeof fileSystemManager.renameSync).toBe('function')
  await testSubAsync(fileSystemManager.rmdir, 'rmdir')
  expect(typeof fileSystemManager.rmdirSync).toBe('function')
  await testSubAsync(fileSystemManager.saveFile, 'saveFile', {
    savedFilePath: 'string',
  })
  expect(testSchema(fileSystemManager.saveFileSync(), 'string')).toBe(true)
  await testSubAsync(fileSystemManager.stat, 'stat', {stats: statsSchema})
  expect(testSchema(fileSystemManager.statSync(), statsSchema)).toBe(true)
  await testSubAsync(fileSystemManager.truncate, 'truncate')
  expect(typeof fileSystemManager.truncateSync).toBe('function')
  await testSubAsync(fileSystemManager.unlink, 'unlink')
  expect(typeof fileSystemManager.unlinkSync).toBe('function')
  await testSubAsync(fileSystemManager.unzip, 'unzip')
  await testSubAsync(fileSystemManager.write, 'write', {
    bytesWritten: 'number',
  })
  await testSubAsync(fileSystemManager.writeFile, 'writeFile')
  expect(typeof fileSystemManager.writeFileSync).toBe('function')
  expect(
    testSchema(fileSystemManager.writeSync(), {bytesWritten: 'number'})
  ).toBe(true)

  await testAsync('pluginLogin', {code: 'string'})
  await testAsync('login', {code: 'string'})
  await testAsyncAndPromise('checkSession')

  testSync('getAccountInfoSync', {
    miniProgram: {
      appId: 'string',
      envVersion: 'string',
      version: 'string',
    },
    plugin: 'undefined',
  })

  const userInfoSchema = {
    userInfo: {
      nickName: 'string',
      avatarUrl: 'string',
      gender: 'number',
      country: 'string',
      province: 'string',
      city: 'string',
      language: 'string',
    },
    rawData: 'string',
    signature: 'string',
    encryptedDat: 'string',
    iv: 'string',
    cloudID: 'string',
  }
  await testAsyncAndPromise('getUserProfile', userInfoSchema)
  await testAsync('getUserInfo', userInfoSchema)

  await testAsync('authorizeForMiniProgram')
  await testAsyncAndPromise('authorize')

  const settingSchema = {
    authSetting: {
      userInfo: 'boolean',
      userLocation: 'boolean',
      address: 'boolean',
      invoiceTitle: 'boolean',
      invoice: 'boolean',
      werun: 'boolean',
      record: 'boolean',
      writePhotosAlbum: 'boolean',
      camera: 'boolean',
      bluetooth: 'boolean',
      addPhoneContact: 'boolean',
      addPhoneCalendar: 'boolean',
    },
    subscriptionsSetting: {
      mainSwitch: 'boolean',
      itemSettings: {},
    },
    miniprogramAuthSetting: 'undefined',
  }
  await testAsyncAndPromise('openSetting', settingSchema)
  await testAsyncAndPromise('getSetting', settingSchema)

  await testAsyncAndPromise('chooseAddress', {
    userName: 'string',
    postalCode: 'string',
    provinceName: 'string',
    cityName: 'string',
    countyName: 'string',
    detailInfo: 'string',
    detailInfoNew: 'string',
    nationalCode: 'string',
    telNumber: 'string',
  })

  await testAsyncAndPromise('openCard')
  await testAsyncAndPromise('addCard', {
    cardList: [
      {
        code: 'string',
        cardId: 'string',
        cardExt: 'string',
        isSuccess: 'boolean',
      },
    ],
  })

  await testAsyncAndPromise('chooseInvoiceTitle', {
    type: 'string',
    title: 'string',
    taxNumber: 'string',
    companyAddress: 'string',
    telephone: 'string',
    bankName: 'string',
    bankAccount: 'string',
  })
  await testAsyncAndPromise('chooseInvoice', {invoiceInfo: 'string'})

  await testAsyncAndPromise('startSoterAuthentication', {
    authMode: 'string',
    resultJSON: 'string',
    resultJSONSignature: 'string',
  })
  await testAsyncAndPromise('checkIsSupportSoterAuthentication', {
    supportMode: ['string'],
  })
  await testAsyncAndPromise('checkIsSoterEnrolledInDevice', {
    isEnrolled: 'boolean',
  })

  await testAsyncAndPromise('shareToWeRun')
  await testAsync('getWeRunData', {
    encryptedData: 'string',
    iv: 'string',
    cloudID: 'string',
  })

  await testAsyncAndPromise('requestSubscribeMessage')
  await testAsyncAndPromise('requestSubscribeDeviceMessage')

  await testAsyncAndPromise('showRedPackage')

  await testAsyncAndPromise('addVideoToFavorites')
  await testAsyncAndPromise('addFileToFavorites')

  await testAsync('checkIsAddedToMyMiniProgram', {added: 'boolean'})
  await testAsyncAndPromise('chooseLicensePlate', {plateNumber: 'string'})

  expect(typeof wx.reserveChannelsLive).toBe('function')
  await testAsync('openChannelsUserProfile')
  await testAsync('openChannelsLive')
  await testAsync('openChannelsEvent')
  await testAsync('openChannelsActivity')
  await testAsync('getChannelsShareKey', {
    sharerOpenId: 'string',
    promoter: {
      finderNickname: 'string',
      promoterId: 'string',
      promoterOpenId: 'string',
    },
  })
  await testAsync('getChannelsLiveNoticeInfo', {
    noticeId: 'string',
    status: 'number',
    startTime: 'string',
    headUrl: 'string',
    nickname: 'string',
    reservable: 'boolean',
    otherInfos: [{}],
  })
  await testAsync('getChannelsLiveInfo', {
    feedId: 'string',
    nonceId: 'string',
    description: 'string',
    status: 'number',
    headUrl: 'string',
    nickname: 'string',
    replayStatus: 'number',
    otherInfos: [{}],
  })

  await testAsync('requestDeviceVoIP')
  await testAsync('getDeviceVoIPList', {
    list: [
      {
        sn: 'string',
        model_id: 'string',
        group_id: 'string',
        status: 'number',
      },
    ],
  })

  await testAsync('getGroupEnterInfo', {
    encryptedData: 'string',
    iv: 'string',
    cloudID: 'string',
  })

  await testAsync('openCustomerServiceChat')

  await testAsyncAndPromise('stopBluetoothDevicesDiscovery')
  await testAsyncAndPromise('startBluetoothDevicesDiscovery')
  await testAsyncAndPromise('openBluetoothAdapter')
  expect(typeof wx.onBluetoothDeviceFound).toBe('function')
  expect(typeof wx.onBluetoothAdapterStateChange).toBe('function')
  expect(typeof wx.offBluetoothDeviceFound).toBe('function')
  expect(typeof wx.offBluetoothAdapterStateChange).toBe('function')
  await testAsyncAndPromise('makeBluetoothPair')
  await testAsyncAndPromise('isBluetoothDevicePaired')
  await testAsyncAndPromise('getConnectedBluetoothDevices', {
    devices: [{name: 'string', deviceId: 'string'}],
  })
  await testAsyncAndPromise('getBluetoothDevices', {
    devices: [
      {
        name: 'string',
        deviceId: 'string',
        RSSI: 'number',
        advertisData: 'buffer',
        advertisServiceUUIDs: ['string'],
        localName: 'string',
        serviceData: {},
        connectable: 'boolean',
      },
    ],
  })
  await testAsyncAndPromise('getBluetoothAdapterState')
  await testAsyncAndPromise('closeBluetoothAdapter')

  await testAsyncAndPromise('writeBLECharacteristicValue')
  await testAsyncAndPromise('setBLEMTU', {mtu: 'number'})
  await testAsyncAndPromise('readBLECharacteristicValue')
  expect(typeof wx.onBLEMTUChange).toBe('function')
  expect(typeof wx.onBLEConnectionStateChange).toBe('function')
  expect(typeof wx.onBLECharacteristicValueChange).toBe('function')
  expect(typeof wx.offBLEMTUChange).toBe('function')
  expect(typeof wx.offBLEConnectionStateChange).toBe('function')
  expect(typeof wx.offBLECharacteristicValueChange).toBe('function')
  await testAsyncAndPromise('notifyBLECharacteristicValueChange')
  await testAsyncAndPromise('getBLEMTU', {mtu: 'number'})
  await testAsyncAndPromise('getBLEDeviceServices', {
    services: [{uuid: 'string', isPrimary: 'boolean'}],
  })
  await testAsyncAndPromise('getBLEDeviceRSSI', {RSSI: 'number'})
  await testAsyncAndPromise('getBLEDeviceCharacteristics', {
    characteristics: [{uuid: 'string', properties: {}}],
  })
  await testAsyncAndPromise('createBLEConnection')
  await testAsyncAndPromise('closeBLEConnection')

  expect(typeof wx.onBLEPeripheralConnectionStateChanged).toBe('function')
  expect(typeof wx.offBLEPeripheralConnectionStateChanged).toBe('function')
  await testAsyncAndPromise('createBLEPeripheralServer')
  const {server: bLEPeripheralServer} = await wx.createBLEPeripheralServer()
  await testSubAsync(bLEPeripheralServer.addService, 'addService')
  await testSubAsync(bLEPeripheralServer.close, 'close')
  await testSubAsync(bLEPeripheralServer.removeService, 'removeService')
  await testSubAsync(bLEPeripheralServer.startAdvertising, 'startAdvertising')
  await testSubAsync(bLEPeripheralServer.stopAdvertising, 'stopAdvertising')
  await testSubAsync(
    bLEPeripheralServer.writeCharacteristicValue,
    'writeCharacteristicValue'
  )
  testSchema(bLEPeripheralServer, {
    onCharacteristicWriteRequest: 'function',
    offCharacteristicWriteRequest: 'function',
    onCharacteristicReadRequest: 'function',
    offCharacteristicReadRequest: 'function',
    onCharacteristicSubscribed: 'function',
    offCharacteristicSubscribed: 'function',
    onCharacteristicUnsubscribed: 'function',
    offCharacteristicUnsubscribed: 'function',
  })

  await testAsyncAndPromise('stopBeaconDiscovery')
  await testAsyncAndPromise('startBeaconDiscovery')
  expect(typeof wx.onBeaconUpdate).toBe('function')
  expect(typeof wx.onBeaconServiceChange).toBe('function')
  expect(typeof wx.offBeaconUpdate).toBe('function')
  expect(typeof wx.offBeaconServiceChange).toBe('function')
  await testAsyncAndPromise('getBeacons', {
    beacons: [
      {
        uuid: 'string',
        major: 'number',
        minor: 'number',
        proximity: 'number',
        accuracy: 'number',
        rssi: 'number',
      },
    ],
  })

  const nFCAdapter = wx.getNFCAdapter()
  await testSubAsync(nFCAdapter.startDiscovery, 'startDiscovery')
  await testSubAsync(nFCAdapter.stopDiscovery, 'stopDiscovery')
  expect(nFCAdapter.getNdef()).toBe(undefined)
  expect(nFCAdapter.getNfcA()).toBe(undefined)
  expect(nFCAdapter.getNfcB()).toBe(undefined)
  expect(nFCAdapter.getIsoDep()).toBe(undefined)
  expect(nFCAdapter.getNfcF()).toBe(undefined)
  expect(nFCAdapter.getNfcV()).toBe(undefined)
  expect(nFCAdapter.getMifareClassic()).toBe(undefined)
  expect(nFCAdapter.getMifareUltralight()).toBe(undefined)
  expect(typeof nFCAdapter.onDiscovered).toBe('function')
  expect(typeof nFCAdapter.offDiscovered).toBe('function')

  await testAsyncAndPromise('stopWifi')
  await testAsyncAndPromise('startWifi')
  await testAsyncAndPromise('setWifiList')
  expect(typeof wx.onWifiConnectedWithPartialInfo).toBe('function')
  expect(typeof wx.onWifiConnected).toBe('function')
  expect(typeof wx.onGetWifiList).toBe('function')
  expect(typeof wx.offWifiConnectedWithPartialInfo).toBe('function')
  expect(typeof wx.offWifiConnected).toBe('function')
  expect(typeof wx.offGetWifiList).toBe('function')
  await testAsyncAndPromise('getWifiList')
  await testAsyncAndPromise('getConnectedWifi', {
    wifi: {
      SSID: 'string',
      BSSID: 'string',
      secure: 'boolean',
      signalStrength: 'number',
      frequency: 'number',
    },
  })
  await testAsyncAndPromise('connectWifi')

  await testAsyncAndPromise('addPhoneRepeatCalendar')
  await testAsyncAndPromise('addPhoneCalendar')

  await testAsync('chooseContact', {
    phoneNumber: 'string',
    displayName: 'string',
  })
  await testAsyncAndPromise('addPhoneContact')

  await testAsyncAndPromise('checkIsOpenAccessibility', {open: 'boolean'})

  testSync('getBatteryInfoSync', {
    level: 'number',
    isCharging: 'boolean',
  })
  await testAsyncAndPromise('getBatteryInfo', {
    level: 'number',
    isCharging: 'boolean',
  })

  await testAsyncAndPromise('setClipboardData')
  await testAsyncAndPromise('getClipboardData', {data: 'string'})

  await testAsyncAndPromise('stopHCE')
  await testAsyncAndPromise('startHCE')
  await testAsyncAndPromise('sendHCEMessage')
  expect(typeof wx.onHCEMessage).toBe('function')
  expect(typeof wx.offHCEMessage).toBe('function')
  await testAsyncAndPromise('getHCEState')

  expect(typeof wx.onNetworkWeakChange).toBe('function')
  expect(typeof wx.onNetworkStatusChange).toBe('function')
  expect(typeof wx.offNetworkWeakChange).toBe('function')
  expect(typeof wx.offNetworkStatusChange).toBe('function')
  await testAsyncAndPromise('getNetworkType', {
    networkType: 'string',
    signalStrength: 'number',
    hasSystemProxy: 'boolean',
  })
  await testAsync('getLocalIPAddress', {
    localip: 'string',
    netmask: 'string',
  })

  await testAsyncAndPromise(
    'getRandomValues',
    {
      randomValues: 'buffer',
    },
    {length: 1}
  )

  await testAsync('setVisualEffectOnCapture')
  await testAsyncAndPromise('setScreenBrightness')
  await testAsyncAndPromise('setKeepScreenOn')
  expect(typeof wx.onUserCaptureScreen).toBe('function')
  expect(typeof wx.onScreenRecordingStateChanged).toBe('function')
  expect(typeof wx.offUserCaptureScreen).toBe('function')
  expect(typeof wx.offScreenRecordingStateChanged).toBe('function')
  await testAsync('getScreenRecordingState', {state: 'string'})
  await testAsyncAndPromise('getScreenBrightness', {value: 'number'})

  expect(typeof wx.onKeyboardHeightChange).toBe('function')
  expect(typeof wx.offKeyboardHeightChange).toBe('function')
  await testAsyncAndPromise('hideKeyboard')
  await testAsyncAndPromise('getSelectedTextRange', {
    start: 'number',
    end: 'number',
  })

  await testAsyncAndPromise('makePhoneCall')

  await testAsyncAndPromise('stopAccelerometer')
  await testAsyncAndPromise('startAccelerometer')
  expect(typeof wx.onAccelerometerChange).toBe('function')
  expect(typeof wx.offAccelerometerChange).toBe('function')

  await testAsyncAndPromise('stopCompass')
  await testAsyncAndPromise('startCompass')
  expect(typeof wx.onCompassChange).toBe('function')
  expect(typeof wx.offCompassChange).toBe('function')

  await testAsyncAndPromise('stopDeviceMotionListening')
  await testAsyncAndPromise('startDeviceMotionListening')
  expect(typeof wx.onDeviceMotionChange).toBe('function')
  expect(typeof wx.offDeviceMotionChange).toBe('function')

  await testAsyncAndPromise('stopGyroscope')
  await testAsyncAndPromise('startGyroscope')
  expect(typeof wx.onGyroscopeChange).toBe('function')
  expect(typeof wx.offGyroscopeChange).toBe('function')

  expect(typeof wx.onMemoryWarning).toBe('function')
  expect(typeof wx.offMemoryWarning).toBe('function')

  await testAsyncAndPromise('scanCode', {
    result: 'string',
    scanType: 'string',
    charSet: 'string',
    path: 'string',
    rawData: 'string',
  })

  await testAsync('sendSms')

  await testAsyncAndPromise('vibrateShort')
  await testAsyncAndPromise('vibrateLong')

  await testAsync('getInferenceEnvInfo', {ver: 'string'})
  const inferenceSession = wx.createInferenceSession()
  expect(typeof inferenceSession.onLoad).toBe('function')
  expect(typeof inferenceSession.offLoad).toBe('function')
  expect(typeof inferenceSession.onError).toBe('function')
  expect(typeof inferenceSession.offError).toBe('function')
  expect(typeof inferenceSession.run).toBe('function')
  expect(inferenceSession.run()).toBeInstanceOf(Promise)
  expect(typeof inferenceSession.destroy).toBe('function')

  testSync('isVKSupport', 'boolean')
  const vkSession = wx.createVKSession()
  testSchema(vkSession, {
    state: 'number',
    config: {
      version: 'string',
      track: {
        plane: {mode: 'number'},
        marker: 'boolean',
        OSD: 'boolean',
        face: {mode: 'number'},
        OCR: {mode: 'number'},
        body: {mode: 'number'},
        hand: {mode: 'number'},
        threeDof: 'boolean',
      },
      gl: 'undefined',
    },
    cameraSize: {
      width: 'number',
      height: 'number',
    },
    start: 'function',
    stop: 'function',
    destroy: 'function',
    requestAnimationFrame: 'function',
    cancelAnimationFrame: 'function',
    removeMarker: 'function',
    removeOSDMarker: 'function',
    update3DMode: 'function',
    updateOSDThreshold: 'function',
    detectFace: 'function',
    detectBody: 'function',
    detectHand: 'function',
    runOCR: 'function',
    on: 'function',
    off: 'function',
  })
  const vkFrame = vkSession.getVKFrame()
  testSchema(vkFrame, {
    timestamp: 'number',
    camera: {
      viewMatrix: 'buffer',
      intrinsics: 'buffer',
    },
  })
  expect(vkFrame.camera.getProjectionMatrix()).toHaveProperty('byteLength')
  testSchema(vkFrame.getCameraTexture(), {
    yTexture: 'undefined',
    uvTexture: 'undefined',
  })
  expect(vkFrame.getCameraBuffer()).toHaveProperty('byteLength')
  expect(vkFrame.getDisplayTransform()).toHaveProperty('byteLength')
  testSchema(vkSession.hitTest(), ['number'])
  testSchema(vkSession.addMarker(), 'number')
  testSchema(vkSession.getAllMarker(), [
    {
      markerId: 'number',
      path: 'string',
    },
  ])
  testSchema(vkSession.addOSDMarker(), 'number')
  testSchema(vkSession.getAllOSDMarker(), [
    {
      markerId: 'number',
      path: 'string',
    },
  ])

  await testAsync('stopFaceDetect')
  await testAsync('initFaceDetect')
  await testAsync('faceDetect', {
    detectRect: {
      height: 'number',
      width: 'number',
      originX: 'number',
      originY: 'number',
    },
    x: 'number',
    y: 'number',
    pointArray: [{}],
    confArray: {
      global: 'number',
      leftEye: 'number',
      rightEye: 'number',
      mouth: 'number',
      nose: 'number',
    },
    angleArray: {pitch: 'number', yaw: 'number', roll: 'number'},
    faceInfo: [{}],
  })

  testSync('createWorker', {
    postMessage: 'function',
    terminate: 'function',
    testOnProcessKilled: 'function',
    onMessage: 'function',
    onProcessKilled: 'function',
  })

  expect(typeof wx.createSelectorQuery).toBe('function')
  expect(typeof wx.createIntersectionObserver).toBe('function')

  testSync('getExtConfigSync', {})
  await testAsync('getExtConfig', {extConfig: {}})

  const adSchema = {
    destroy: 'function',
    onLoad: 'function',
    offLoad: 'function',
    onError: 'function',
    offError: 'function',
    onClose: 'function',
    offClose: 'function',
  }
  const rewardedVideoAd = wx.createRewardedVideoAd()
  testSchema(rewardedVideoAd, adSchema)
  expect(rewardedVideoAd.load).toBeInstanceOf(Promise)
  expect(rewardedVideoAd.show).toBeInstanceOf(Promise)
  const interstitialAd = wx.createInterstitialAd()
  testSchema(interstitialAd, adSchema)
  expect(interstitialAd.load).toBeInstanceOf(Promise)
  expect(interstitialAd.show).toBeInstanceOf(Promise)
})
