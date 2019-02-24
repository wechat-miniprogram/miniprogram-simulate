const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id, {prop: 'index.test.properties'})

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, '<wx-view class="main--index">index.test.properties</wx-view>')).toBe(true)
    expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe('green')
    expect(comp.dom.tagName).toBe('MAIN')
}

test('comp1', () => {
    let id = simulate.load(path.resolve(__dirname, './index'))
    runTest(id)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    id = simulate.load(path.resolve(__dirname, './index'), { compiler: simulate })
    runTest(id)
})
