const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id, {prop: 'index.test.properties'})

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, `
        <wx-view class="custom-comp--index">index.test.properties</wx-view>
        <wx-view data-index="0" data-type="3">haha</wx-view>
        <wx-view data-index="1" data-type="4">hehe</wx-view>
        <other-comp class="custom-comp--other"><wx-view class="other-comp--index">other.properties</wx-view></other-comp>
    `)).toBe(true)
    expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe('green')
    expect(window.getComputedStyle(comp.querySelector('.index').dom).width).toBe('100px')
    expect(window.getComputedStyle(comp.querySelector('.other').querySelector('.index').dom).color).toBe('rgb(255, 255, 0)')
    expect(comp.dom.tagName).toBe('CUSTOM-COMP')
}

test('comp2', () => {
    let id = simulate.load(path.resolve(__dirname, './index'), 'custom-comp')
    runTest(id)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    id = simulate.load(path.resolve(__dirname, './index'), 'custom-comp', {compiler: 'simulate'})
    runTest(id)
})
