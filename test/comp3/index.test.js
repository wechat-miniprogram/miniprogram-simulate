const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp3', async() => {
  const id = simulate.loadComponent(path.resolve(__dirname, './index'))
  const comp = simulate.render(id)

  const parent = document.body
  comp.attach(parent)

  const view = comp.querySelector('.index')
  expect(view.dom.innerHTML).toBe('index.properties')
  expect(window.getComputedStyle(comp.querySelector('.inner').dom).color).toBe(
    'red'
  )

  view.dispatchTapEvent()
  expect(view.dom.innerHTML).toBe('comp3.properties')

  expect(comp.instance.print()).toBe(123)

  comp.detach()
})
