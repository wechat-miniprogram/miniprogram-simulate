const crypto = require('crypto')

const simulate = require('../../index')
const _ = require('../utils')

test('getShareInfo', async () => {
    const appid = 'wx4f4bc4dec97d474b'
    const sessionKey = new Buffer('tiihtNczf5v6AKRyjwEUhQ==', 'base64')
    const res = await _.wa(wx.getShareInfo)

    // base64 decode
    const encryptedData = new Buffer(res.encryptedData, 'base64')
    const iv = new Buffer(res.iv, 'base64')

    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    decipher.setAutoPadding(true) // 设置自动 padding 为 true，删除填充补位

    let decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)

    expect(decoded.watermark.appid).toBe(appid)
})

test('hideShareMenu', async () => {
    const res = await _.wa(wx.hideShareMenu)
    expect(res.errMsg).toEqual('hideShareMenu:ok')
})

test('showShareMenu', async () => {
    const res = await _.wa(wx.showShareMenu)
    expect(res.errMsg).toEqual('showShareMenu:ok')
})

test('updateShareMenu', async () => {
    const res = await _.wa(wx.updateShareMenu)
    expect(res.errMsg).toEqual('updateShareMenu:ok')
})
