const simulate = require('../../index')
const _ = require('../utils')

test('getLogManager', async () => {
    expect(wx.getLogManager()).toBe(console)
})

test('setEnableDebug', () => {
    expect(wx.setEnableDebug(true)).toBe(null)
})
