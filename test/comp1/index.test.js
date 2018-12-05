const path = require('path')
const simulate = require('../../index')

test('comp1', () => {
    const id = simulate.load(path.join(__dirname, './index'))
    const comp = simulate.render(id, {prop: 'index.test.properties'})

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, '<wx-view class="index">index.test.properties</wx-view>')).toBe(true)
})
