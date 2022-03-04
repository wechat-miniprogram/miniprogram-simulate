const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id, {prop: 'index.test.properties'})

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, `
        <wx-view>root</wx-view>
        <comp1 class="custom-comp--comp1">
            <wx-view class="comp1--index">from root</wx-view>
            <comp2 class="comp1--comp2">
                <wx-view class="comp2--index">from comp1</wx-view>
            </comp2>
        </comp1>
    `)).toBe(true)
    expect(comp.querySelector('.comp1').instance.getStr).toBeInstanceOf(Function)
    expect(comp.querySelector('.comp1').instance.getStr()).toBe('comp1')
    expect(comp.querySelector('.comp1').querySelector('.comp2').instance.getStr).toBeInstanceOf(Function)
    expect(comp.querySelector('.comp1').querySelector('.comp2').instance.getStr()).toBe('comp2')
    expect(comp.dom.tagName).toBe('CUSTOM-COMP')
}

test('comp11', () => {
    let comp2Id = simulate.load(path.resolve(__dirname, './comp/comp2'), 'comp2', {
        rootPath: __dirname,
    })
    let id = simulate.load(path.resolve(__dirname, './index'), 'custom-comp', {
        usingComponents: {
            comp1: './comp/comp1',
            comp2: comp2Id,
        },
        rootPath: __dirname,
    })
    runTest(id)

    jest.resetModules() // https://github.com/facebook/jest/issues/5120

    comp2Id = simulate.load(path.resolve(__dirname, './comp/comp2'), 'comp2', {
        rootPath: __dirname,
        compiler: 'simulate',
    })
    id = simulate.load(path.resolve(__dirname, './index'), 'custom-comp', {
        usingComponents: {
            comp1: './comp/comp1',
            comp2: comp2Id,
        },
        rootPath: __dirname,
        compiler: 'simulate',
    })
    runTest(id)
})
