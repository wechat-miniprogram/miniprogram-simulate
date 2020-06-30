const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, '<wx-view>some msg</wx-view><wx-view>\'hello world\' from tools.wxs</wx-view>')).toBe(true)
}

test('comp7', () => {
    const id = simulate.load(path.resolve(__dirname, './index'))
    runTest(id)
})
