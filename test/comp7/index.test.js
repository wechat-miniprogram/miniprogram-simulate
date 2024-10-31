const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp7', () => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'))
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(
    "<view>some msg</view><view>'hello world' from tools.wxs</view>"
  )
})
