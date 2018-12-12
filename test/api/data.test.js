const simulate = require('../../index')
const _ = require('../utils')

test('clearStorage', async () => {
    wx.setStorageSync('ta1', 123)
    wx.setStorageSync('ta2', 321)
    expect(wx.getStorageSync('ta1')).toBe(123)
    expect(wx.getStorageSync('ta2')).toBe(321)

    await _.wa(wx.clearStorage)

    expect(wx.getStorageSync('ta1')).toBe(null)
    expect(wx.getStorageSync('ta2')).toBe(null)
})

test('clearStorageSync', () => {
    wx.setStorageSync('ta1', 123)
    wx.setStorageSync('ta2', 321)
    expect(wx.getStorageSync('ta1')).toBe(123)
    expect(wx.getStorageSync('ta2')).toBe(321)

    wx.clearStorageSync()

    expect(wx.getStorageSync('ta1')).toBe(null)
    expect(wx.getStorageSync('ta2')).toBe(null)
})

test('getStorageInfo', async () => {
    wx.clearStorageSync()
    let res = await _.wa(wx.getStorageInfo)
    expect(res).toEqual({
        errMsg: 'getStorageInfo:ok',
        keys: [],
        currentSize: 0,
        limitSize: 1024 * 10,
    })

    wx.setStorageSync('ta1', 123)
    wx.setStorageSync('ta2', '小程序')
    res = await _.wa(wx.getStorageInfo)
    expect(res).toEqual({
        errMsg: 'getStorageInfo:ok',
        keys: ['ta1', 'ta2'],
        currentSize: 14,
        limitSize: 1024 * 10,
    })
})

test('getStorageInfoSync', () => {
    wx.clearStorageSync()
    let res = wx.getStorageInfoSync()
    expect(res).toEqual({
        keys: [],
        currentSize: 0,
        limitSize: 1024 * 10,
    })

    wx.setStorageSync('ta1', 123)
    wx.setStorageSync('ta2', '小程序')
    res = wx.getStorageInfoSync()
    expect(res).toEqual({
        keys: ['ta1', 'ta2'],
        currentSize: 14,
        limitSize: 1024 * 10,
    })
})

test('removeStorage', async () => {
    wx.setStorageSync('rrx', 123)
    expect(wx.getStorageSync('rrx')).toBe(123)

    await _.wa(wx.removeStorage, { key: 'rrx' })
    expect(wx.getStorageSync('rrx')).toBe(null)

    await _.wa(wx.removeStorage, { key: 'rrx' })
    expect(wx.getStorageSync('rrx')).toBe(null)
})

test('removeStorageSync', () => {
    wx.setStorageSync('rrr', 123)
    expect(wx.getStorageSync('rrr')).toBe(123)

    wx.removeStorageSync('rrr')
    expect(wx.getStorageSync('rrr')).toBe(null)

    wx.removeStorageSync('rrr')
    expect(wx.getStorageSync('rrr')).toBe(null)

})

test('setStorage/getStorage', async () => {
    let res
    await _.wa(wx.setStorage, { key: 'haha', data: 12345 })
    res = await _.wa(wx.getStorage, { key: 'haha' })
    expect(res.data).toBe(12345)

    await _.wa(wx.setStorage, { key: 'ddo', data: '12345' })
    res = await _.wa(wx.getStorage, { key: 'ddo' })
    expect(res.data).toBe('12345')

    await _.wa(wx.setStorage, { key: 'qq', data: {
        a: 12,
        b: [
            { c: 55, d: { e: 13 } },
            { c: 21, d: { e: 10 } }
        ]
    }})
    res = await _.wa(wx.getStorage, { key: 'qq' })
    expect(res.data).toEqual({
        a: 12,
        b: [
            { c: 55, d: { e: 13 } },
            { c: 21, d: { e: 10 } }
        ]
    })
})

test('setStorageSync/getStorageSync', () => {
    wx.setStorageSync('abc', 123)
    expect(wx.getStorageSync('abc')).toBe(123)

    wx.setStorageSync('cba', '123')
    expect(wx.getStorageSync('cba')).toBe('123')

    wx.setStorageSync('dd', {
        a: 12,
        b: [
            { c: 55, d: { e: 13 } },
            { c: 21, d: { e: 10 } }
        ]
    })
    expect(wx.getStorageSync('dd')).toEqual({
        a: 12,
        b: [
            { c: 55, d: { e: 13 } },
            { c: 21, d: { e: 10 } }
        ]
    })
})

