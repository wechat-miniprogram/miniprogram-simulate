const path = require('path')
const simulate = require('../../index')

test('comp3', async () => {
    const childId = simulate.load({
        id: 'abc',
        template: '<div><slot/></div>',
    })
    const id = simulate.load(path.resolve(__dirname, './index'), { less: true })
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    const view = comp.querySelector('.index')
    expect(view.dom.innerHTML).toBe('<div>index.properties</div>')
    expect(window.getComputedStyle(comp.querySelector('.inner').dom).color).toBe('red')
    
    view.dispatchEvent('touchstart')
    view.dispatchEvent('touchend')
    await simulate.sleep(10)
    expect(view.dom.innerHTML).toBe('<div>comp3.properties</div>')

    expect(comp.instance.print()).toBe(123)
})
