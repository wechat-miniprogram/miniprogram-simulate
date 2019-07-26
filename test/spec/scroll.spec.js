/* global simulate */
const expect = require('chai').expect

describe('scroll', () => {
    it('should run successfully', async() => {
        const comp = {
            dom: document.createElement('div')
        }
        const child = document.createElement('div')
        document.body.appendChild(comp.dom)
        comp.dom.style.cssText = 'position: relative; width: 100px; height: 100px; overflow: scroll;'
        comp.dom.appendChild(child)
        child.style.cssText = 'position: relative; width: 1000px; height: 1000px;'

        expect(comp.dom.scrollTop).to.equal(0)
        let scrollTopList = []
        let scrollLeftList = []
        comp.dom.addEventListener('scroll', () => {
            scrollTopList.push(comp.dom.scrollTop)
            scrollLeftList.push(comp.dom.scrollLeft)
        })
        simulate.scroll(comp, 40)
        await simulate.sleep(200)
        expect(comp.dom.scrollTop).to.equal(40)
        expect(scrollTopList.length > 0).to.equal(true)

        scrollTopList = []
        simulate.scroll(comp, 30)
        await simulate.sleep(200)
        expect(comp.dom.scrollTop).to.equal(30)
        expect(scrollTopList.length > 0).to.equal(true)

        scrollTopList = []
        simulate.scroll(comp, -100)
        await simulate.sleep(200)
        expect(comp.dom.scrollTop).to.equal(0)
        expect(scrollTopList.length > 0).to.equal(true)

        scrollLeftList = []
        simulate.scroll(comp, 10, null, 'scrollLeft')
        await simulate.sleep(200)
        expect(comp.dom.scrollLeft).to.equal(10)
        expect(scrollLeftList.length > 0).to.equal(true)
    })
})
