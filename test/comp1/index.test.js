const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp1', () => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'))

  const comp = simulate.render(id, {
    prop: 'index.test.properties',
    hasChild: true,
  })

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(
    '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
  )
  expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe(
    'green'
  )
  expect(comp.dom.tagName).toBe('MAIN')

  comp.triggerPageLifeTime('show', {test: 'xxx'})

  expect(comp.instance.data.observerArr).toEqual([
    'index.test.properties',
    'index.properties',
    'index.test.properties',
    'observers',
    'pageShow',
    {test: 'xxx'},
  ])
})
