const entryList = [{
  entryType: 'navigation',
  name: 'appLaunch',
  duration: 5734,
  navigationType: 'appLaunch',
  pageId: 1,
  path: 'pages/index/index',
  startTime: 1687833887576,
}, {
  entryType: 'script',
  name: 'evaluateScript',
  startTime: 1687833890475,
  duration: 2,
  moduleName: '__APP__',
  fileList: ['/app-service.js']
}, {
  entryType: 'loadPackage',
  name: 'downloadPackage',
  startTime: 1687833891277,
  duration: 56,
  packageName: '__APP__',
  packageSize: 0
}, {
  entryType: 'render',
  name: 'firstRender',
  startTime: 1687833893239,
  duration: 71,
  path: 'pages/index/index',
  pageId: 1,
  viewLayerReadyTime: 1687833890600,
  initDataSendTime: 1687833893267,
  initDataRecvTime: 1687833893300,
  viewLayerRenderStartTime: 1687833893300,
  viewLayerRenderEndTime: 1687833893309
}, {
  entryType: 'render',
  name: 'firstPaint',
  startTime: 1687833893318,
  path: 'pages/index/index',
  pageId: 1
}, {
  entryType: 'render',
  name: 'firstContentfulPaint',
  startTime: 1687833893318,
  path: 'pages/index/index',
  pageId: 1
}, {
  entryType: 'render',
  name: 'largestContentfulPaint',
  startTime: 1687833893318,
  path: 'pages/index/index',
  pageId: 1
}]

class PerformanceObserver {
  disconnect() {}

  observe() {}
}

class Performance {
  createObserver() {
    return new PerformanceObserver()
  }

  getEntries() {
    return [...entryList]
  }

  getEntriesByName(name, entryType) {
    return entryList.filter(item => item.name === name && item.entryType === entryType)
  }

  getEntriesByType(entryType) {
    return entryList.filter(item => item.entryType === entryType)
  }

  setBufferSize() {}
}

module.exports = Performance
