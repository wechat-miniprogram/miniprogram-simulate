const _ = require('./utils')
const {OffscreenCanvas} = require('./canvas')

class MapContext {
  addArc(options) {
    _.mockAsync('addArc')(options)
  }

  addCustomLayer(options) {
    _.mockAsync('addCustomLayer')(options)
  }

  addGroundOverlay(options) {
    _.mockAsync('addGroundOverlay')(options)
  }

  addMarkers(options) {
    _.mockAsync('addMarkers')(options)
  }

  addVisualLayer(options) {
    _.mockAsync('addVisualLayer')(options)
  }

  eraseLines(options) {
    _.mockAsync('eraseLines')(options)
  }

  executeVisualLayerCommand(options) {
    _.mockAsync('executeVisualLayerCommand', {
      data: '{}',
    })(options)
  }

  fromScreenLocation(options) {
    _.mockAsync('fromScreenLocation', {
      latitude: 23.12908,
      longitude: 113.26436,
    })(options)
  }

  getCenterLocation(options) {
    _.mockAsync('getCenterLocation', {
      latitude: 23.12908,
      longitude: 113.26436,
    })(options)
  }

  getRegion(options) {
    _.mockAsync('getRegion', {
      southwest: {
        latitude: 39.91506279020459,
        longitude: 116.44712539672851,
      },
      northeast: {
        latitude: 39.92493685384383,
        longitude: 116.47287460327148,
      },
    })(options)
  }

  getRotate(options) {
    _.mockAsync('getRotate', {
      rotate: 0,
    })(options)
  }

  getScale(options) {
    _.mockAsync('getScale', {
      scale: 14,
    })(options)
  }

  getSkew(options) {
    _.mockAsync('getSkew', {
      scale: 0,
    })(options)
  }

  includePoints(options) {
    _.mockAsync('includePoints')(options)
  }

  initMarkerCluster(options) {
    _.mockAsync('initMarkerCluster')(options)
  }

  moveAlong(options) {
    _.mockAsync('moveAlong')(options)
  }

  moveToLocation(options) {
    _.mockAsync('moveToLocation')(options)
  }

  on() {}

  openMapApp(options) {
    _.mockAsync('openMapApp')(options)
  }

  removeArc(options) {
    _.mockAsync('removeArc')(options)
  }

  removeCustomLayer(options) {
    _.mockAsync('removeCustomLayer')(options)
  }

  removeGroundOverlay(options) {
    _.mockAsync('removeGroundOverlay')(options)
  }

  removeMarkers(options) {
    _.mockAsync('removeMarkers')(options)
  }

  removeVisualLayer(options) {
    _.mockAsync('removeVisualLayer')(options)
  }

  setBoundary(options) {
    _.mockAsync('setBoundary')(options)
  }

  setCenterOffset(options) {
    _.mockAsync('setCenterOffset')(options)
  }

  setLocMarkerIcon(options) {
    _.mockAsync('setLocMarkerIcon')(options)
  }

  toScreenLocation(options) {
    _.mockAsync('toScreenLocation', {
      x: 0,
      y: 0,
    })(options)
  }

  translateMarker(options) {
    _.mockAsync('translateMarker')(options)
  }

  updateGroundOverlay(options) {
    _.mockAsync('updateGroundOverlay')(options)
  }
}

class VideoContext {
  exitBackgroundPlayback() {}

  exitCasting() {}

  exitFullScreen() {}

  exitPictureInPicture(options) {
    _.mockAsync('exitPictureInPicture')(options)
  }

  hideStatusBar() {}

  pause() {}

  play() {}

  playbackRate() {}

  reconnectCasting() {}

  requestBackgroundPlayback() {}

  requestFullScreen() {}

  seek() {}

  sendDanmu() {}

  showStatusBar() {}

  startCasting() {}

  stop() {}

  switchCasting() {}
}

class LivePlayerContext {
  exitCasting(options) {
    _.mockAsync('exitCasting')(options)
  }

  exitFullScreen(options) {
    _.mockAsync('exitFullScreen')(options)
  }

  exitPictureInPicture(options) {
    _.mockAsync('exitPictureInPicture')(options)
  }

  mute(options) {
    _.mockAsync('mute')(options)
  }

  pause(options) {
    _.mockAsync('pause')(options)
  }

  play(options) {
    _.mockAsync('play')(options)
  }

  reconnectCasting(options) {
    _.mockAsync('reconnectCasting')(options)
  }

  requestFullScreen(options) {
    _.mockAsync('requestFullScreen')(options)
  }

  requestPictureInPicture(options) {
    _.mockAsync('requestPictureInPicture')(options)
  }

  resume(options) {
    _.mockAsync('resume')(options)
  }

  snapshot(options) {
    _.mockAsync('snapshot', {
      tempImagePath: '/',
      width: 100,
      height: 100,
    })(options)
  }

  startCasting(options) {
    _.mockAsync('startCasting')(options)
  }

  stop(options) {
    _.mockAsync('stop')(options)
  }

  switchCasting(options) {
    _.mockAsync('switchCasting')(options)
  }
}

class LivePusherContext {
  applyBlusherStickMakeup(options) {
    _.mockAsync('applyBlusherStickMakeup')(options)
  }

  applyEyeBrowMakeup(options) {
    _.mockAsync('applyEyeBrowMakeup')(options)
  }

  applyEyeShadowMakeup(options) {
    _.mockAsync('applyEyeShadowMakeup')(options)
  }

  applyFaceContourMakeup(options) {
    _.mockAsync('applyFaceContourMakeup')(options)
  }

  applyFilter(options) {
    _.mockAsync('applyFilter')(options)
  }

  applyLipStickMakeup(options) {
    _.mockAsync('applyLipStickMakeup')(options)
  }

  applySticker(options) {
    _.mockAsync('applySticker')(options)
  }

  clearFilters(options) {
    _.mockAsync('clearFilters')(options)
  }

  clearMakeups(options) {
    _.mockAsync('clearMakeups')(options)
  }

  clearStickers(options) {
    _.mockAsync('clearStickers')(options)
  }

  createOffscreenCanvas() {
    return new OffscreenCanvas()
  }

  exitPictureInPicture(options) {
    _.mockAsync('exitPictureInPicture')(options)
  }

  getMaxZoom(options) {
    _.mockAsync('getMaxZoom', {
      maxZoom: '',
    })(options)
  }

  onCustomRendererEvent() {}

  pause(options) {
    _.mockAsync('pause')(options)
  }

  pauseBGM(options) {
    _.mockAsync('pauseBGM')(options)
  }

  playBGM(options) {
    _.mockAsync('playBGM')(options)
  }

  resume(options) {
    _.mockAsync('resume')(options)
  }

  resumeBGM(options) {
    _.mockAsync('resumeBGM')(options)
  }

  sendMessage(options) {
    _.mockAsync('sendMessage')(options)
  }

  setBGMVolume(options) {
    _.mockAsync('setBGMVolume')(options)
  }

  setMICVolume(options) {
    _.mockAsync('setMICVolume')(options)
  }

  setZoom(options) {
    _.mockAsync('setZoom')(options)
  }

  snapshot(options) {
    _.mockAsync('snapshot', {
      tempImagePath: '/',
      width: 100,
      height: 100,
    })(options)
  }

  start(options) {
    _.mockAsync('start')(options)
  }

  startPreview(options) {
    _.mockAsync('startPreview')(options)
  }

  stop(options) {
    _.mockAsync('stop')(options)
  }

  stopBGM(options) {
    _.mockAsync('stopBGM')(options)
  }

  stopPreview(options) {
    _.mockAsync('stopPreview')(options)
  }

  switchCamera(options) {
    _.mockAsync('switchCamera')(options)
  }

  toggleTorch(options) {
    _.mockAsync('toggleTorch')(options)
  }
}

class CameraContext {
  onCameraFrame() {
    return {
      start: _.mockAsync('start'),
      stop: _.mockAsync('stop'),
    }
  }

  setZoom(options) {
    _.mockAsync('setZoom', {zoom: 1})(options)
  }

  startRecord(options) {
    _.mockAsync('startRecord', {
      tempThumbPath: '/',
      tempVideoPath: '/',
    })(options)
  }

  stopRecord(options) {
    _.mockAsync('stopRecord', {
      tempThumbPath: '/',
      tempVideoPath: '/',
    })(options)
  }

  takePhoto(options) {
    _.mockAsync('takePhoto', {
      tempImagePath: '/',
    })(options)
  }
}

module.exports = {
  MapContext,
  VideoContext,
  LivePlayerContext,
  LivePusherContext,
  CameraContext,
}
