const path = require('path')
const simulate = require('../../src')

async function runTest(id) {
  const comp = simulate.render(id)

  const parent = document.body
  comp.attach(parent)

  const view = comp.querySelector('.index')
  expect(view.dom.innerHTML).toBe('index.properties')
  expect(window.getComputedStyle(comp.querySelector('.inner').dom).color).toBe('red')

  view.dispatchTapEvent()
  expect(view.dom.innerHTML).toBe('comp3.properties')

  expect(comp.instance.print()).toBe(123)

  comp.detach()
}

test('comp3', async() => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  await runTest(id)
})
