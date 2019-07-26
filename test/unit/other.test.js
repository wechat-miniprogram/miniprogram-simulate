const simulate = require('../../index')

test('sleep', async() => {
    let start = +new Date()
    await simulate.sleep(50)
    expect(+new Date() - start >= 50).toBe(true)

    start = +new Date()
    await simulate.sleep(100)
    expect(+new Date() - start >= 100).toBe(true)

    start = +new Date()
    await simulate.sleep()
    expect(+new Date() - start >= 0).toBe(true)
})

test('scroll', async() => {
    const comp = {
        dom: document.createElement('div')
    }

    expect(comp.dom.scrollTop).toBe(0)
    let scrollTopList = []
    let scrollLeftList = []
    comp.dom.addEventListener('scroll', () => {
        scrollTopList.push(comp.dom.scrollTop)
        scrollLeftList.push(comp.dom.scrollLeft)
    })
    simulate.scroll(comp, 40, 10)
    await simulate.sleep(15)
    expect(comp.dom.scrollTop).toBe(40)
    expect(scrollTopList).toEqual([4, 8, 12, 16, 20, 24, 28, 32, 36, 40])

    scrollTopList = []
    simulate.scroll(comp, 30, 3)
    await simulate.sleep(10)
    expect(comp.dom.scrollTop).toBe(30)
    expect(scrollTopList).toEqual([37, 34, 30])

    scrollTopList = []
    simulate.scroll(comp, -100, 7)
    await simulate.sleep(10)
    expect(comp.dom.scrollTop).toBe(0)
    expect(scrollTopList).toEqual([26, 22, 18, 14, 10, 6, 0])

    scrollLeftList = []
    simulate.scroll(comp, 10, 6, 'scrollLeft')
    await simulate.sleep(10)
    expect(comp.dom.scrollLeft).toBe(10)
    expect(scrollLeftList).toEqual([1, 2, 3, 4, 5, 10])
})
