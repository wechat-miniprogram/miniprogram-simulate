const path = require('path')
const simulate = require('../../src')

function runTest(id) {
  const comp = simulate.render(id, {prop: 'index.test.properties', hasChild: true})

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe('<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>')
  expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe('green')
  expect(comp.dom.tagName).toBe('MAIN')

  comp.triggerPageLifeTime('show', {test: 'xxx'})

  expect(comp.instance.data.observerArr).toEqual(['index.test.properties', 'index.properties', 'index.test.properties', 'observers', 'pageShow', {test: 'xxx'}])
}

test('comp1', () => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  runTest(id)
})
