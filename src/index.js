/* global Event */
const path = require('path')
const jComponent = require('j-component')

const _ = require('./utils')
const wxss = require('./wxss')
const compile = require('./compile')
const injectPolyfill = require('./polyfill')
const injectDefinition = require('./definition')

const componentMap = {}
let nowLoad = null

/**
 * 自定义组件构造器
 */
global.Component = options => {
  const component = nowLoad
  const definition = Object.assign({
    id: component.id,
    template: component.wxml,
    usingComponents: component.json.usingComponents,
    tagName: component.tagName,
    options: {
      classPrefix: component.tagName,
    },
  }, options)

  component.id = jComponent.register(definition)
}

/**
 * behavior 构造器
 */
global.Behavior = definition => jComponent.behavior(definition)

/**
 * 加载 behavior
 */
function behavior(definition) {
  if (typeof definition !== 'object') {
    throw new Error('definition must be a object')
  }

  return jComponent.behavior(definition)
}

/**
 * 注册自定义组件
 */
function register(componentPath, tagName, cache, hasRegisterCache) {
  // 用于 wcc 编译器使用
  if (window.__webview_engine_version__ !== 0.02) window.__webview_engine_version__ = 0.02

  if (typeof componentPath === 'object') {
    // 直接传入定义对象
    const definition = componentPath

    return jComponent.register(definition)
  }

  if (typeof componentPath !== 'string') {
    throw new Error('componentPath must be a string')
  }

  if (!tagName || typeof tagName !== 'string') {
    tagName = 'main' // 默认标签名
  }

  const id = _.getId()

  if (hasRegisterCache[componentPath]) return hasRegisterCache[componentPath]
  hasRegisterCache[componentPath] = id
  
  const oldLoad = nowLoad
  const component = nowLoad = {
    id,
    tagName,
    json: _.readJson(`${componentPath}.json`),
  }
  
  if (!component.json) {
    throw new Error(`invalid componentPath: ${componentPath}`)
  }
  
  // 先加载 using components
  const usingComponents = component.json.usingComponents || {}
  const usingComponentKeys = Object.keys(usingComponents)
  for (let i = 0, len = usingComponentKeys.length; i < len; i++) {
    const key = usingComponentKeys[i]
    const usingPath = path.join(path.dirname(componentPath), usingComponents[key])
    const id = register(usingPath, key, cache, hasRegisterCache)
    
    usingComponents[key] = id
  }
  
  // 读取自定义组件的静态内容
  debugger
  component.wxml = compile.getWxml(componentPath, cache.options)
  component.wxss = wxss.getContent(`${componentPath}.wxss`)

  // 执行自定义组件的 js
  _.runJs(componentPath)

  // 保存追加了已编译的 wxss
  cache.wxss.push(wxss.compile(component.wxss, {
    prefix: tagName,
    ...cache.options,
  }))

  nowLoad = oldLoad

  return component.id
}

/**
 * 加载自定义组件
 */
function load(componentPath, tagName, options = {}) {
  if (typeof tagName === 'object') {
    options = tagName
    tagName = ''
  }

  if (typeof componentPath === 'string') {
    options = Object.assign({
      compiler: 'official', // official - 官方编译器、simulate - 纯 js 实现的模拟编译器
      rootPath: path.dirname(componentPath), // 项目根路径
    }, options)
  } else {
    options = Object.assign({
      compiler: 'simulate',
      rootPath: '',
    }, options)
  }

  const cache = {
    wxss: [],
    options,
  }
  const hasRegisterCache = {}
  const id = register(componentPath, tagName, cache, hasRegisterCache)

  // 存入缓存
  componentMap[id] = cache

  return id
}

/**
 * 渲染自定义组件
 */
function render(id, properties) {
  if (!id) throw new Error('you need to pass the componentId')

  const cache = componentMap[id]

  if (cache) {
    // 注入 wxss
    wxss.insert(cache.wxss, id)
  }

  return jComponent.create(id, properties)
}

/**
 * 比较 dom 节点是否符合某个 html 结构
 */
function match(dom, html) {
  if (!(dom instanceof window.Element) || !html || typeof html !== 'string') return false

  // 干掉一些换行符，以免生成不必要的 TextNode
  html = html.trim()
    .replace(/(>)[\n\r\s\t]+(<)/g, '$1$2')

  const a = dom.cloneNode()
  const b = dom.cloneNode()

  a.innerHTML = dom.innerHTML
  b.innerHTML = html

  return a.isEqualNode(b)
}

/**
 * 让线程等待一段时间再执行
 */
function sleep(time = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/**
 * 模拟滚动
 */
function scroll(comp, destOffset = 0, times = 20, propName = 'scrollTop') {
  if (!comp || !comp.dom) throw new Error('invalid params')
  if (typeof times !== 'number' || times <= 0) times = 1

  destOffset = destOffset < 0 ? 0 : destOffset

  const dom = comp.dom
  const delta = destOffset - dom[propName]
  // eslint-disable-next-line no-bitwise
  const unit = ~~(delta / times)
  const env = _.getEnv()

  if (env === 'nodejs') {
    for (let i = 0; i < times; i++) {
      // nodejs 环境
      setTimeout(() => {
        if (i === times - 1) dom[propName] = destOffset
        else dom[propName] += unit

        // 模拟异步触发
        dom.dispatchEvent(new Event('scroll', {bubbles: true, cancelable: false}))
      }, 0)
    }
  } else {
    // 浏览器
    dom[propName] = destOffset
  }
}


injectPolyfill()
injectDefinition()

module.exports = {
  behavior,
  load,
  render,
  match,
  sleep,
  scroll,
}
