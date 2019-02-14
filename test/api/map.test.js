const simulate = require('../../index')
const _ = require('../utils')
const MapContext = require('../../src/api/map')

test('createMapContext', async () => {
    const id = await simulate.load({
        template: `<div><map id="abc"></map></div>`,
        attached() {
            this.ctx = wx.createMapContext('abc', this)
        },
    })
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(comp.instance.ctx).toBeInstanceOf(MapContext)
    expect(comp.instance.ctx._exparserNode.$$.tagName).toBe('WX-MAP')

    let res = await _.wa(comp.instance.ctx.getCenterLocation)
    expect(res).toEqual({
        errMsg: 'getMapCenterLocation:ok',
        latitude: 39.92,
        longitude: 116.46,
    })

    res = await _.wa(comp.instance.ctx.getRegion)
    expect(res).toEqual({
        errMsg: 'getMapRegion:ok',
        northeast: {
            latitude: 39.92493685384383,
            longitude: 116.47287460327148,
        },
        southwest: {
            latitude: 39.91506279020459,
            longitude: 116.44712539672851,
        },
    })

    res = await _.wa(comp.instance.ctx.getScale)
    expect(res).toEqual({
        errMsg: 'getMapScale:ok',
        scale: 14,
    })

    res = await _.wa(comp.instance.ctx.includePoints)
    expect(res.errMsg).toBe('includePoints:ok')

    expect(comp.instance.ctx.moveToLocation()).toBe(null)

    res = await _.wa(comp.instance.ctx.translateMarker)
    expect(res.errMsg).toBe('translateMarker:ok')
})
