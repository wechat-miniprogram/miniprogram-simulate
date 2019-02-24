const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(comp.dom.innerHTML).toBe('<other-comp><wx-view>component b</wx-view></other-comp>')
}

test('comp4', () => {
    let id = simulate.load(path.resolve(__dirname, './index'))
    runTest(id)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    id = simulate.load(path.resolve(__dirname, './index'), { compiler: 'simulate' })
    runTest(id)
})
