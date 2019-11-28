/* global simulate */
const path = require('path')
const expect = require('chai').expect

describe('comp1', () => {
    it('should run successfully', () => {
        const id = simulate.load(path.join(__dirname, '../comp1/index'))
        const comp = simulate.render(id, {prop: 'index.test.properties'})

        comp.attach(document.body)

        expect(simulate.match(comp.dom, '<wx-view class="main--index">index.test.properties</wx-view>')).to.equal(true)
        expect(window.getComputedStyle(comp.querySelector('.index').dom).color).to.equal('rgb(0, 128, 0)')
        expect(comp.dom.tagName).to.equal('MAIN')
    })
})
