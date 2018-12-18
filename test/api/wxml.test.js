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
    // TODO
})
