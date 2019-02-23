const path = require('path')
const simulate = require('../../index')

test('comp4', () => {
    const id = simulate.load(path.resolve(__dirname, './index'))
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(comp.dom.innerHTML).toBe('<other-comp><wx-view>component b</wx-view></other-comp>')
})
