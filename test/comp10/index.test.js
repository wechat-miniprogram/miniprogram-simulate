const path = require('path')
const simulate = require('../../index')

function runTest(id) {
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, '<wx-view>hello june</wx-view>')).toBe(true)
}

test('comp10', () => {
    const id = simulate.load(path.resolve(__dirname, './index'), {
        compilerOptions: {
            maxBuffer: 2 * 1024 * 1024,
            wxmlList: [
                'index.wxml',
                'tmpl1/extra.wxml',
                'tmpl1/extra2.wxml',
                'tmpl1/extra3.wxml',
                'tmpl1/extra4.wxml',
                'tmpl1/extra5.wxml',
                'tmpl1/extra6.wxml',
                'tmpl1/extra7.wxml',
                'tmpl1/extra8.wxml',
            ],
            wxsList: [
                'index.wxs',
            ],
        },
    })

    runTest(id)
})
