const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp2', () => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'), 'custom-comp')
  const comp = simulate.render(id, {prop: 'index.test.properties'})

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(
    simulate.trimHTML(`
    <view class="custom-comp--index">index.test.properties</view>
    <view index="0" type="3">haha</view>
    <view index="1" type="4">hehe</view>
    <other-comp class="custom-comp--other"><view class="other-comp--index">other.properties</view></other-comp>
  `)
  )
  expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe(
    'green'
  )
  expect(window.getComputedStyle(comp.querySelector('.index').dom).width).toBe(
    '10vw'
  )
  expect(
    window.getComputedStyle(
      comp.querySelector('.other').querySelector('.index').dom
    ).color
  ).toBe('yellow')
  expect(comp.querySelector('.other').instance.getStr).toBeInstanceOf(Function)
  expect(comp.querySelector('.other').instance.getStr()).toBe('other')
  expect(comp.dom.tagName).toBe('CUSTOM-COMP')
  expect(comp.querySelector('.other').instance.selectOwnerComponent()).toBe(
    comp.instance
  )
})
