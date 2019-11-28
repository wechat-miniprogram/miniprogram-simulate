/* global simulate */
const path = require('path')
const expect = require('chai').expect

describe('comp7', () => {
    it('should run successfully', async() => {
        const id = simulate.load(path.join(__dirname, '../comp7/index'))
        const comp = simulate.render(id)

        const parent = document.createElement('parent-wrapper')
        comp.attach(parent)

        expect(simulate.match(comp.dom, `<wx-view>some msg</wx-view><wx-view>'hello world' from tools.wxs</wx-view>`)).to.equal(true)
    })
})
