const simulate = require('../../index')
const _ = require('../utils')

test('chooseLocation', async () => {
    const res = await _.wa(wx.chooseLocation)

    expect(res).toEqual({
        errMsg: 'chooseLocation:ok',
        address: '广东省广州市海珠区tit创意园品牌街',
        name: '腾讯微信总部',
        latitude: 23.1001,
        longitude: 113.32456,
    })
})

test('getLocation', async () => {
    const res = await _.wa(wx.getLocation)

    expect(res).toEqual({
        errMsg: 'getLocation:ok',
        accuracy: 65,
        altitude: 0,
        latitude: 23.12908,
        longitude: 113.26436,
        speed: -1,
        verticalAccuracy: 65,
        horizontalAccuracy: 65,
    })
})

test('openLocation', async () => {
    const res = await _.wa(wx.openLocation)
    expect(res.errMsg).toBe('openLocation:ok')
})
