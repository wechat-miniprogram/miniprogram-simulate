const path = require('path')
const simulate = require('../../index')

test('comp3', () => {
    const childId = simulate.load({
        id: 'abc',
        template: '<div><slot/></div>',
    })
    const id = simulate.load(path.join(__dirname, './index'))
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    const view = comp.querySelector('.index')
    expect(view.dom.innerHTML).toBe('<div>index.properties</div>')
    
    view.dispatchEvent('touchstart')
    view.dispatchEvent('touchend')
    expect(view.dom.innerHTML).toBe('<div>comp3.properties</div>')

    expect(comp.instance.print()).toBe(123)
})
