const path = require('path')
const simulate = require('../../index')

async function runTest(id) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    const view = comp.querySelector('.index')
    expect(view.dom.innerHTML).toBe('<div>index.properties</div>')
    expect(window.getComputedStyle(comp.querySelector('.inner').dom).color).toBe('red')

    view.dispatchEvent('touchstart')
    view.dispatchEvent('touchend')
    await simulate.sleep(200)
    expect(view.dom.innerHTML).toBe('<div>comp3.properties</div>')

    expect(comp.instance.print()).toBe(123)
}

test('comp3', async() => {
    simulate.load({
        id: 'abc',
        template: '<div><slot/></div>',
    })
    let id = simulate.load(path.resolve(__dirname, './index'), {less: true})
    await runTest(id)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    id = simulate.load(path.resolve(__dirname, './index'), {less: true, compiler: 'simulate'})
    await runTest(id)
})
