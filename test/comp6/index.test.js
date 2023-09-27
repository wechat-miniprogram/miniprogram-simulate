const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp6', () => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'))
  const comp = simulate.render(id, {
    prop: 'index.test.properties',
    hasChild: true,
  })

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(
    simulate.trimHTML(`
    <view class="main--index">index.test.properties</view>
    <view>index.test.properties</view>
    <view>index.properties</view>
  `)
  )
  expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe(
    'green'
  )
  expect(comp.dom.tagName).toBe('MAIN')

  expect(comp.instance.data.observerArr).toEqual([
    'index.test.properties',
    'index.properties',
  ])
})
