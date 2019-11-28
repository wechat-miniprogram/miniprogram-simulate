/* global simulate */
const path = require('path')
const expect = require('chai').expect

describe('comp5', () => {
    it('should run successfully', async() => {
        const id = simulate.load(path.join(__dirname, '../comp5/index'))
        const comp = simulate.render(id)

        const parent = document.createElement('parent-wrapper')
        comp.attach(parent)

        expect(simulate.match(comp.dom, `
            <wx-view>head</wx-view>
            <wx-text>tmpl</wx-text>
            <wx-view>
                <wx-text>7: I am msg</wx-text>
                <wx-text>Time: 12345</wx-text>
            </wx-view>
            <wx-view>hello june</wx-view>
            <wx-view>
                <wx-view>if</wx-view>
                <wx-view>node content</wx-view>
                <comp>
                    <wx-view>
                        <wx-text> I am comp</wx-text>
                        <wx-view>I am slot</wx-view>
                    </wx-view>
                </comp>
                <wx-view>1-item</wx-view>
                <wx-view>2-item</wx-view>
                <wx-view>3-item</wx-view>
                <wx-view>in block1</wx-view>
                <wx-text>in block2</wx-text>
                <comp>
                    <wx-view>
                        <wx-text>haha I am comp</wx-text>
                    </wx-view>
                </comp>
            </wx-view>
            <wx-view>foot</wx-view>
        `)).to.equal(true)
    })
})
