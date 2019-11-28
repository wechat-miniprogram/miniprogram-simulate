/* global simulate */
const path = require('path')
const expect = require('chai').expect

describe('comp3', () => {
    it('should run successfully', async() => {
        simulate.load({
            id: 'abc',
            template: '<div><slot/></div>',
        }, {compiler: 'simulate'})
        const id = simulate.load(path.join(__dirname, '../comp3/index'), {less: true})
        const comp = simulate.render(id)

        comp.attach(document.body)

        const view = comp.querySelector('.index')
        expect(view.dom.innerHTML).to.equal('<div>index.properties</div>')
        expect(window.getComputedStyle(comp.querySelector('.inner').dom).color).to.equal('rgb(255, 0, 0)')

        view.dispatchEvent('touchstart')
        view.dispatchEvent('touchend')
        await simulate.sleep(10)
        expect(view.dom.innerHTML).to.equal('<div>comp3.properties</div>')

        expect(comp.instance.print()).to.equal(123)
    })
})
