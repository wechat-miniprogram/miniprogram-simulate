const path = require('path')
const simulate = require('../../src')

function runTest(id) {
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe('<view>some msg</view><view>\'hello world\' from tools.wxs</view>')
}

test('comp7', () => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  runTest(id)
})
