const jComponent = require('j-component')

const api = require('./api')

const officialTagList = [
  'cover-image', 'cover-view', 'grid-view', 'list-view', 'match-media', 'movable-area', 'movable-view', 'page-container', 'root-portal', 'scroll-view', 'share-element', 'sticky-header', 'sticky-section', 'swiper', 'swiper-item', 'view',
  'icon', 'progress', 'rich-text', 'text',
  'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'keyboard-accessory', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
  'functional-page-navigator', 'navigator',
  'audio', 'camera', 'channel-live', 'channel-video', 'image', 'live-player', 'live-pusher', 'video', 'voip-room',
  'map',
  'canvas',
  'web-view', 'ad', 'ad-custom', 'official-account', 'open-data',
  'navigation-bar',
  'page-meta',
]

module.exports = function() {
  // 注册内置组件
  officialTagList.forEach(name => {
    jComponent.register({
      id: name,
      tagName: `wx-${name}`,
      template: '<slot/>',
    })
  })

  // 注入 api
  if (typeof global.wx === 'object') global.wx = Object.assign(api, global.wx)
  else global.wx = api
}
