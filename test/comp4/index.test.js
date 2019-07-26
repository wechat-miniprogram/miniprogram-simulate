const path = require('path')
const simulate = require('../../index')

async function runTest(id, data) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    if (data) {
        const child = comp.querySelector('#a')
        child.instance.triggerSome(data)
        await simulate.sleep(10)
    }

    expect(comp.dom.innerHTML).toBe(`<wx-view>${data || 1}</wx-view><other-comp><wx-view>component b</wx-view></other-comp>`)
}

test('comp4', async() => {
    let id = simulate.load(path.resolve(__dirname, './index'))
    await runTest(id)
    await runTest(id, 998)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    id = simulate.load(path.resolve(__dirname, './index'), {compiler: 'simulate'})
    await runTest(id)
    await runTest(id, 998)
})
