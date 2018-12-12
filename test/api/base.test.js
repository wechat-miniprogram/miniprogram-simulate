const simulate = require('../../index')

test('canIUse', () => {
    expect(wx.canIUse('button.open-type.contact')).toBe(true)
})
