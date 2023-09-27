const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp4', async() => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'))
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.dom.innerHTML).toBe(
    '<view>1</view><other-comp><view>component b</view></other-comp>'
  )

  const child = comp.querySelector('#a')
  child.instance.triggerSome(998)
  await new Promise(resolve => setTimeout(resolve, 10))

  expect(comp.dom.innerHTML).toBe(
    '<view>998</view><other-comp><view>component b</view></other-comp>'
  )
})
