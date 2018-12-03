const path = require('path')
const jComponent = require('j-component')

const _ = require('./utils')
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
    template: component.wxml,
    usingComponents: component.json.usingComponents,
    tagName: component.tagName,
  }, options)

  component.id = jComponent.register(definition)
}

/**
 * behavior 构造器
 */
global.Behavior = options => jComponent.behavior(options)

/**
 * 加载自定义组件
 */
async function load(componentPath, tagName) {
  if (typeof componentPath === 'object') {
    // 直接传入定义对象
    const definition = componentPath

    return jComponent.register(definition)
  }

  const oldLoad = nowLoad
  const component = nowLoad = {}

  // 读取自定义组件的静态内容
  component.tagName = tagName
  component.wxml = await _.readFile(`${componentPath}.wxml`)
  component.wxss = await _.readFile(`${componentPath}.wxss`) // TODO
  component.json = _.readJson(`${componentPath}.json`)

  if (!component.json) {
    throw new Error(`invalid component: ${componentPath}`)
  }

  // 先加载 using components
  const usingComponents = component.json.usingComponents || {}
  const usingComponentKeys = Object.keys(usingComponents)
  for (let i = 0, len = usingComponentKeys.length; i < len; i++) {
    const key = usingComponentKeys[i]
    const usingPath = path.join(path.dirname(componentPath), usingComponents[key])
    // eslint-disable-next-line no-await-in-loop
    const id = await load(usingPath)

    usingComponents[key] = id
  }

  // require 自定义组件的 js
  // eslint-disable-next-line import/no-dynamic-require
  require(componentPath)

  nowLoad = oldLoad
  componentMap[componentPath] = component

  return component.id
}

/**
 * 渲染自定义组件
 */
function render(componentId, properties) {
  if (!componentId) throw new Error('you need to pass the componentId')

  return jComponent.create(componentId, properties)
}

/**
 * 比较 dom 节点是否符合某个 html 结构
 */
function match(dom, html) {
  if (!(dom instanceof window.Element) || !html || typeof html !== 'string') return false

  // remove some
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

injectPolyfill()
injectDefinition()

module.exports = {
  load,
  render,
  match,
  sleep,
}
