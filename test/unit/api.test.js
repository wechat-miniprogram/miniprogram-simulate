const wx = require('../../src/api/index')

const testSync = (name, schema, ...args) => expect(testSchema(wx[name](...args), schema)).toBe(true)
const wrapAsync = func => (options = {}) => new Promise(resolve => func({ ...options, success: resolve }))
const testAsync = async (name, schema, ...args) => {
  const res = await wrapAsync(wx[name])(...args)
  expect(res).toHaveProperty('errMsg', `${name}:ok`)
  if (schema) expect(testSchema(res, schema)).toBe(true)
}
const testSubAsync = async (func, name, schema, ...args) => {
  const res = await wrapAsync(func)(...args)
  expect(res).toHaveProperty('errMsg', `${name}:ok`)
  if (schema) expect(testSchema(res, schema)).toBe(true)
}
const testAsyncAndPromise = async (name, schema, ...args) => {
  await testAsync(name, schema, ...args)
  expect(await wx[name](...args)).toHaveProperty('errMsg', `${name}:ok`)
}
const testSchema = (data, schema) => {
  const dataType = typeof data
  const schemaType = typeof schema

  if (schema === 'any') return true
  else if (schemaType === 'string' && schema !== 'buffer' && dataType !== schema) {
    console.log('testSchemaFailed[1]', dataType, schema)
    return false
  } if (dataType === 'object') {
    const isDataArray = Array.isArray(data)
    const isSchemaArray = Array.isArray(schema)

    if (isDataArray !== isSchemaArray) {
      console.log('testSchemaFailed[2]', isDataArray, isSchemaArray)
      return false
    } else if (isDataArray) {
      const subSchema = schema[0]
      if (subSchema === 'any') return true
      else {
        for (const item of data) {
          const res = testSchema(item, subSchema)
          if (!res) {
            console.log('testSchemaFailed[3]', item, subSchema)
            return false
          }
        }

        return true
      }
    } else if (schema === 'buffer') {
      const res = typeof data.byteLength !== 'undefined'
      if (!res) console.log('testSchemaFailed[4]', data, schema)
      return res
    } else {
      const schemaKeys = Object.keys(schema)
      for (const schemaKey of schemaKeys) {
        const res = testSchema(data[schemaKey], schema[schemaKey])
        if (!res) {
          console.log('testSchemaFailed[5]', schemaKey, data[schemaKey], schema[schemaKey])
          return false
        }
      }

      return true
    }
  } else {
    const res = dataType === schema
    if (!res) console.log('testSchemaFailed[6]', dataType, schema)
    return res
  }
} 

test('api', async () => {
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
    host: { env: 'string' },
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
  // wx.getRendererUserAgent TODO
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
    host: { env: 'string' },
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
    forwardMaterials: [{
      type: 'string',
      name: 'string',
      path: 'string',
      size: 'number',
    }],
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
  expect(testSchema(realtimeLogManager.getCurrentState(), {
    size: 'number',
    maxSize: 'number',
    logCount: 'number',
    maxLogCount: 'number',
  })).toBe(true)
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
  const entrySchema = [{
    entryType: 'string',
    name: 'string',
    startTime: 'number',
  }]
  expect(testSchema(performance.getEntries(), entrySchema)).toBe(true)
  expect(testSchema(performance.getEntriesByName(), entrySchema)).toBe(true)
  expect(testSchema(performance.getEntriesByType(), entrySchema)).toBe(true)
  expect(typeof performance.setBufferSize).toBe('function')
  
  const preDownloadSubpackageTask = wx.preDownloadSubpackage()
  expect(testSchema(await new Promise(resolve => preDownloadSubpackageTask.onProgressUpdate(resolve)), {
    progress: 'number',
    totalBytesWritten: 'number',
    totalBytesExpectedToWrite: 'number',
  })).toBe(true)
  const userCryptoManager = wx.getUserCryptoManager()
  await testSubAsync(userCryptoManager.getLatestUserKey, 'getLatestUserKey', {
    encryptKey: 'string',
    expireTime: 'number',
    iv: 'string',
    version: 'number',
  })
  await testSubAsync(userCryptoManager.getRandomValues, 'getRandomValues', {
    randomValues: 'buffer',
  }, { length: 1 })
  
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

  await testAsyncAndPromise('loadFontFace', { status: 'string' })

  await testAsyncAndPromise('stopPullDownRefresh')
  await testAsyncAndPromise('startPullDownRefresh')

  await testAsyncAndPromise('pageScrollTo')

  // wx.createAnimation TODO

  await testAsyncAndPromise('setTopBarText')

  // wx.nextTick TODO

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

  // wx.worklet TODO

  // wx.request TODO

  // wx.downloadFile TODO
  
  // wx.uploadFile TODO

  await testAsyncAndPromise('sendSocketMessage')
  expect(typeof wx.onSocketOpen).toBe('function')
  expect(typeof wx.onSocketMessage).toBe('function')
  expect(typeof wx.onSocketError).toBe('function')
  expect(typeof wx.onSocketClose).toBe('function')
  // wx.connectSocket TODO
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

  // wx.createTCPSocket TODO

  // wx.createUDPSocket TODO

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
  await testAsync('getStorage', { data: 'any' })
  testSync('createBufferURL', 'string')
  expect(typeof wx.clearStorageSync).toBe('function')
  await testAsync('clearStorage')
  expect(typeof wx.batchSetStorageSync).toBe('function')
  await testAsync('batchSetStorage')
  testSync('batchGetStorageSync',  ['any'])
  await testAsync('batchGetStorage', { dataList: ['any'] })

  await testAsyncAndPromise('setBackgroundFetchToken')
  expect(typeof wx.onBackgroundFetchData).toBe('function')
  await testAsyncAndPromise('getBackgroundFetchToken', { token: 'string' })
  await testAsyncAndPromise('getBackgroundFetchData', {
    fetchedData: 'string',
    timeStamp: 'number',
    path: 'string',
    query: 'string',
    scene: 'number',
  })

  // wx.createCacheManager TODO

  expect(typeof wx.reportMonitor).toBe('function')
  expect(typeof wx.reportEvent).toBe('function')
  expect(typeof wx.reportAnalytics).toBe('function')
  testSync('getExptInfoSync', {})

  // XR-FRAME
  // 暂不考虑支持

  // 画布
  // TODO

  // 媒体
  // TODO

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
  await testSubAsync(fileSystemManager.getFileInfo, 'getFileInfo', { size: 'number' })
  await testSubAsync(fileSystemManager.getSavedFileList, 'getSavedFileList', { fileList: [{ filePath: 'string', size: 'number' }] })
  await testSubAsync(fileSystemManager.mkdir, 'mkdir')
  expect(typeof fileSystemManager.mkdirSync).toBe('function')
  await testSubAsync(fileSystemManager.open, 'open', { fd: 'string' })
  expect(testSchema(fileSystemManager.openSync(), 'string')).toBe(true)
  await testSubAsync(fileSystemManager.read, 'read', {
    bytesRead: 'number',
    arrayBuffer: 'buffer',
  })
  await testSubAsync(fileSystemManager.readCompressedFile, 'readCompressedFile', {
    data: 'buffer',
  })
  expect(testSchema(fileSystemManager.readCompressedFileSync(), 'buffer')).toBe(true)
  await testSubAsync(fileSystemManager.readdir, 'readdir', { files: ['string'] })
  expect(testSchema(fileSystemManager.readdirSync(), ['string'])).toBe(true)
  await testSubAsync(fileSystemManager.readFile, 'readFile', { data: 'string' })
  expect(testSchema(fileSystemManager.readFileSync(), 'string')).toBe(true)
  expect(testSchema(fileSystemManager.readSync(), {
    bytesRead: 'number',
    arrayBuffer: 'buffer',
  })).toBe(true)
  await testSubAsync(fileSystemManager.readZipEntry, 'readZipEntry', { entries: {} })
  await testSubAsync(fileSystemManager.removeSavedFile, 'removeSavedFile')
  await testSubAsync(fileSystemManager.rename, 'rename')
  expect(typeof fileSystemManager.renameSync).toBe('function')
  await testSubAsync(fileSystemManager.rmdir, 'rmdir')
  expect(typeof fileSystemManager.rmdirSync).toBe('function')
  await testSubAsync(fileSystemManager.saveFile, 'saveFile', { savedFilePath: 'string' })
  expect(testSchema(fileSystemManager.saveFileSync(), 'string')).toBe(true)
  await testSubAsync(fileSystemManager.stat, 'stat', { stats: statsSchema })
  expect(testSchema(fileSystemManager.statSync(), statsSchema)).toBe(true)
  await testSubAsync(fileSystemManager.truncate, 'truncate')
  expect(typeof fileSystemManager.truncateSync).toBe('function')
  await testSubAsync(fileSystemManager.unlink, 'unlink')
  expect(typeof fileSystemManager.unlinkSync).toBe('function')
  await testSubAsync(fileSystemManager.unzip, 'unzip')
  await testSubAsync(fileSystemManager.write, 'write', { bytesWritten: 'number' })
  await testSubAsync(fileSystemManager.writeFile, 'writeFile')
  expect(typeof fileSystemManager.writeFileSync).toBe('function')
  expect(testSchema(fileSystemManager.writeSync(), { bytesWritten: 'number' })).toBe(true)

  // TODO






})
