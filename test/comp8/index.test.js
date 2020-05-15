const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, `<custom-ul><wx-view><custom-li><wx-text>li</wx-text></custom-li><custom-li><wx-text>li</wx-text></custom-li></wx-view></custom-ul>`)).toBe(true)
}

test('comp8', () => {
    let id = simulate.load(path.resolve(__dirname, './index'))
    runTest(id)
})
