const path = require('path')
const simulate = require('../../src')

function runTest(id) {
  const comp = simulate.render(id, {prop: 'index.test.properties', hasChild: true})

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe('<view class="main--index">index.test.properties</view><view>123</view>')
  expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe('green')
  expect(comp.dom.tagName).toBe(undefined)

  comp.triggerPageLifeTime('show', {test: 'xxx'})

  expect(comp.instance.data.observerArr).toEqual(['index.test.properties', 'index.properties', 'index.test.properties', 'observers', 'pageShow', {test: 'xxx'}])
}

test('comp9', () => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  runTest(id)
})
