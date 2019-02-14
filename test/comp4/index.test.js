const path = require('path')
const simulate = require('../../index')

test('comp4', async () => {
    const id = await simulate.load(path.resolve(__dirname, './index'))
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(comp.dom.innerHTML).toBe('<other-comp><wx-view>component b</wx-view></other-comp>')
})
