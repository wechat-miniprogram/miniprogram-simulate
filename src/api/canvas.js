class OffscreenCanvas {
  constructor() {
    this.width = 100
    this.height = 100
  }

  getContext() {
    // 暂不支持返回标准 context
    return {}
  }

  createImage() {
    return new window.Image()
  }
}

class CanvasContext {
  constructor() {
    this.fillStyle = 'black'
    this.strokeStyle = 'red'
    this.shadowOffsetX = 0
    this.shadowOffsetY = 0
    this.shadowColor = 0
    this.shadowBlur = 0
    this.lineWidth = 0
    this.lineCap = 'butt'
    this.lineJoin = 'bevel'
    this.lineDashOffset = 0
    this.font = '10px sans-serif'
    this.globalAlpha = 1
    this.globalCompositeOperation = 'xor'
  }

  arc() {}

  arcTo() {}

  beginPath() {}

  bezierCurveTo() {}

  clearRect() {}

  clip() {}

  closePath() {}

  createCircularGradient() {
    return {
      addColorStop() {},
    }
  }

  createLinearGradient() {
    return {
      addColorStop() {},
    }
  }

  createPattern() {}

  draw() {}

  drawImage() {}

  fill() {}

  fillRect() {}

  fillText() {}

  lineTo() {}

  measureText() {
    return {width: 100}
  }

  moveTo() {}

  quadraticCurveTo() {}

  rect() {}

  restore() {}

  rotate() {}

  save() {}

  scale() {}

  setFillStyle(fillStyle) {
    this.fillStyle = fillStyle
  }

  setFontSize() {}

  setGlobalAlpha() {}

  setLineCap(lineCap) {
    this.lineCap = lineCap
  }

  setLineDash() {}

  setLineJoin(lineJoin) {
    this.lineJoin = lineJoin
  }

  setLineWidth(lineWidth) {
    this.lineWidth = lineWidth
  }

  setMiterLimit(miterLimit) {
    this.miterLimit = miterLimit
  }

  setShadow() {}

  setStrokeStyle(strokeStyle) {
    this.strokeStyle = strokeStyle
  }

  setTextAlign() {}

  setTextBaseline() {}

  setTransform() {}

  stroke() {}

  strokeRect() {}

  strokeText() {}

  transform() {}

  translate() {}
}


module.exports = {
  CanvasContext,
  OffscreenCanvas,
}
