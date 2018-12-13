const simulate = require('../../index')
const _ = require('../utils')

test('getAccountInfoSync', () => {
    expect(wx.getAccountInfoSync()).toEqual({
        miniprogram: { appId: 'wx4f4bc4dec97d474b' },
    })
})
