const simulate = require('../../index')

test('createSelectorQuery', () => {
    const id = simulate.load({
        template: `<view></view>`,
        methods: {
            getSelectorQuery() {
                return wx.createSelectorQuery().in(this)
            },
            getSelectorQuery2() {
                return this.createSelectorQuery()
            },
        },
    })
    const comp = simulate.render(id)

    const selectorQuery = comp.instance.getSelectorQuery()
    const selectorQuery2 = comp.instance.getSelectorQuery2()
    expect(selectorQuery.constructor).toBe(selectorQuery2.constructor)
    expect(selectorQuery._exparserNode).toBe(selectorQuery2._exparserNode)
})

test('createIntersectionObserver', () => {
    const id = simulate.load({
        template: `<view></view>`,
        methods: {
            getIntersectionObserver() {
                return wx.createIntersectionObserver(this)
            },
            getIntersectionObserver2() {
                return this.createIntersectionObserver()
            },
        },
    })
    const comp = simulate.render(id)

    const intersectionObserver = comp.instance.getIntersectionObserver()
    const intersectionObserver2 = comp.instance.getIntersectionObserver2()
    expect(intersectionObserver.constructor).toBe(intersectionObserver2.constructor)
    expect(intersectionObserver._exparserNode).toBe(intersectionObserver2._exparserNode)
})
