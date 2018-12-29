const path = require('path')
const simulate = require('../../index')

test('comp1', () => {
    const id = simulate.load(path.resolve(__dirname, './index'))
    const comp = simulate.render(id, {prop: 'index.test.properties'})

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, '<wx-view class="main--index">index.test.properties</wx-view>')).toBe(true)
    expect(window.getComputedStyle(comp.querySelector('.index').dom).color).toBe('green')
    expect(comp.dom.tagName).toBe('MAIN')
})
