const simulate = require('../../index')
const _ = require('../utils')

test('getExtConfig', async () => {
    const info = await _.wa(wx.getExtConfig)

    expect(info).toEqual({
        errMsg: 'getExtConfig:ok',
        extConfig: wx.getExtConfigSync(),
    })
})

test('getExtConfigSync', () => {
    expect(wx.getExtConfigSync()).toEqual({})
})
