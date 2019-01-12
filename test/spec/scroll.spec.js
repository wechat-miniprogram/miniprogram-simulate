const path = require('path')
const expect = require('chai').expect

describe('scroll', () => {
    it ('should run successfully', async () => {
        const comp = {
            dom: document.createElement('div')
        }
        const child = document.createElement('div')
        document.body.appendChild(comp.dom)
        comp.dom.style.cssText = 'position: relative; width: 100px; height: 100px; overflow: scroll;'
        comp.dom.appendChild(child)
        child.style.cssText = 'position: relative; width: 1000px; height: 1000px;';

        expect(comp.dom.scrollTop).to.equal(0)
        let scrollTopList = []
        let scrollLeftList = []
        comp.dom.addEventListener('scroll', evt => {
            scrollTopList.push(comp.dom.scrollTop)
            scrollLeftList.push(comp.dom.scrollLeft)
        })
        simulate.scroll(comp, 40, 10)
        await simulate.sleep(15)
        expect(comp.dom.scrollTop).to.equal(40)
        expect(scrollTopList.slice(0, 10)).to.deep.equal([4, 8, 12, 16, 20, 24, 28, 32, 36, 40])

        scrollTopList = []
        simulate.scroll(comp, 30, 3)
        await simulate.sleep(10)
        expect(comp.dom.scrollTop).to.equal(30)
        expect(scrollTopList.slice(0, 3)).to.deep.equal([37, 34, 30])

        scrollTopList = []
        simulate.scroll(comp, -100, 7)
        await simulate.sleep(10)
        expect(comp.dom.scrollTop).to.equal(0)
        expect(scrollTopList.slice(0, 7)).to.deep.equal([26, 22, 18, 14, 10, 6, 0])

        scrollLeftList = []
        simulate.scroll(comp, 10, 6, 'scrollLeft')
        await simulate.sleep(10)
        expect(comp.dom.scrollLeft).to.equal(10)
        expect(scrollLeftList.slice(0, 6)).to.deep.equal([1, 2, 3, 4, 5, 10])
    })
})
