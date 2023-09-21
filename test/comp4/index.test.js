const path = require('path')
const simulate = require('../../src')

async function runTest(id, data) {
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  if (data) {
    const child = comp.querySelector('#a')
    child.instance.triggerSome(data)
    await simulate.sleep(10)
  }

  expect(comp.dom.innerHTML).toBe(`<view>${data || 1}</view><other-comp><view>component b</view></other-comp>`)
}

test('comp4', async() => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  await runTest(id)
  await runTest(id, 998)
})
