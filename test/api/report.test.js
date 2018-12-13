const simulate = require('../../index')

test('reportMonitor', () => {
    expect(wx.reportMonitor('1', 1)).toBe(null)
})
