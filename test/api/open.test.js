const crypto = require('crypto')

const simulate = require('../../index')
const _ = require('../utils')

test('getAccountInfoSync', () => {
    expect(wx.getAccountInfoSync()).toEqual({
        miniprogram: { appId: 'wx4f4bc4dec97d474b' },
    })
})

test('chooseAddress', async () => {
    const res = await _.wa(wx.chooseAddress)

    expect(res).toEqual({
        errMsg: 'chooseAddress:ok',
        cityName: '广州市',
        countyName: '海珠区',
        detailInfo: '新港中路397号',
        nationalCode: '510000',
        postalCode: '510000',
        provinceName: '广东省',
        telNumber: '020-81167888',
        userName: '张三',
    })
})

test('authorize', async () => {
    const res = await _.wa(wx.authorize)
    expect(res.errMsg).toBe('authorize:ok')
})

test('addCard', async () => {
    const cardList = [
        { cardId: '123', cardExt: { signature: '321', timestamp: +new Date() } },
        { cardId: 'abc', cardExt: { signature: 'cba', timestamp: +new Date() } },
    ]
    const res = await _.wa(wx.addCard, { cardList })

    expect(res).toEqual({
        errMsg: 'addCard:ok',
        cardList: [{
            code: 'this is a mock code',
            isSuccess: true,
            ...cardList[0]
        }, {
            code: 'this is a mock code',
            isSuccess: true,
            ...cardList[1]
        }]
    })
})

test('openCard', async () => {
    const res = await _.wa(wx.openCard)
    expect(res.errMsg).toBe('openCard:ok')
})

test('reportAnalytics', () => {
    expect(wx.reportAnalytics()).toBe(null)
})

test('chooseInvoice', async () => {
    const res = await _.wa(wx.chooseInvoice)

    expect(res).toEqual({
        errMsg: 'chooseInvoice:ok',
        invoiceInfo: {
            cardId: 'pjZ8Yt5crPbAouhFqFf6JFgZv4Lc',
            encryptCode: 'fbdt/fWy1VitQwhbKtSjNeR3BJyfpeJXfZjjGsdCXiM=',
            publisherAppId: 'wx00000000000000',
        },
    })
})

test('chooseInvoiceTitle', async () => {
    const res = await _.wa(wx.chooseInvoiceTitle)

    expect(res).toEqual({
        errMsg: 'chooseInvoiceTitle:ok',
        bankAccount: '1209 0928 2210 301',
        bankName: '招商银行股份有限公司广州市体育东路支行',
        companyAddress: '广州市海珠区新港中路397号自编72号(商业街F5-1)',
        taxNumber: '91440101327598294H',
        telephone: '020-81167888',
        title: '广州腾讯科技有限公司',
        type: 0,
    })
})

test('checkSession', async () => {
    const res = await _.wa(wx.checkSession)
    expect(res.errMsg).toBe('checkSession:ok')
})

test('login', async () => {
    const res = await _.wa(wx.login)

    expect(res).toEqual({
        errMsg: 'login:ok',
        code: '033UAswz1j8Fjb0lT4yz1Wmrwz1UAsw9',
    })
})

test('navigateBackMiniProgram', async () => {
    const res = await _.wa(wx.navigateBackMiniProgram)
    expect(res.errMsg).toBe('navigateBackMiniProgram:ok')
})

test('navigateToMiniProgram', async () => {
    const res = await _.wa(wx.navigateToMiniProgram)
    expect(res.errMsg).toBe('navigateToMiniProgram:ok')
})

test('requestPayment', async () => {
    const res = await _.wa(wx.requestPayment)
    expect(res.errMsg).toBe('requestPayment:ok')
})

test('getSetting', async () => {
    const res = await _.wa(wx.getSetting)

    expect(res).toEqual({
        errMsg: 'getSetting:ok',
        authSetting: {
            'scope.address': true,
            'scope.invoice': true,
            'scope.invoiceTitle': true,
            'scope.subscribemsg': true,
        },
    })
})

test('openSetting', async () => {
    const res = await _.wa(wx.openSetting)

    expect(res).toEqual({
        errMsg: 'openSetting:ok',
        authSetting: {
            'scope.address': true,
            'scope.invoice': true,
            'scope.invoiceTitle': true,
            'scope.subscribemsg': true,
        },
    })
})

test('checkIsSoterEnrolledInDevice', async () => {
    const res = await _.wa(wx.checkIsSoterEnrolledInDevice)

    expect(res).toEqual({
        errMsg: 'checkIsSoterEnrolledInDevice:ok',
        isEnrolled: true,
    })
})

test('checkIsSupportSoterAuthentication', async () => {
    const res = await _.wa(wx.checkIsSupportSoterAuthentication)

    expect(res).toEqual({
        errMsg: 'checkIsSupportSoterAuthentication:ok',
        supportMode: ['fingerPrint'],
    })
})

test('startSoterAuthentication', async () => {
    const res = await _.wa(wx.startSoterAuthentication)
    expect(res.errMsg).toBe('startSoterAuthentication:ok')
})

test('getUserInfo', async () => {
    const sessionKey = new Buffer('tiihtNczf5v6AKRyjwEUhQ==', 'base64')
    const res = await _.wa(wx.getUserInfo)

    // base64 decode
    const encryptedData = new Buffer(res.encryptedData, 'base64')
    const iv = new Buffer(res.iv, 'base64')

    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    decipher.setAutoPadding(true) // 设置自动 padding 为 true，删除填充补位

    let decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)

    const userInfo = {
        nickName: 'Band',
        gender: 1,
        language: 'zh_CN',
        city: 'Guangzhou',
        province: 'Guangdong',
        country: 'CN',
        avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0',
    }
    expect(res.userInfo).toEqual(userInfo)
    expect(decoded).toEqual({
        openId: 'oGZUI0egBJY1zhBYw2KhdUfwVJJE', 
        unionId: 'ocMvos6NjeKLIBqg5Mr9QjxrP1FA',
        watermark: {
            appid: 'wx4f4bc4dec97d474b',
            timestamp: 1477314187,
        },
        ...userInfo,
    })
})

test('getWeRunData', async () => {
    const sessionKey = new Buffer('tiihtNczf5v6AKRyjwEUhQ==', 'base64')
    const res = await _.wa(wx.getWeRunData)

    // base64 decode
    const encryptedData = new Buffer(res.encryptedData, 'base64')
    const iv = new Buffer(res.iv, 'base64')

    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    decipher.setAutoPadding(true) // 设置自动 padding 为 true，删除填充补位

    let decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)

    expect(decoded).toEqual({
        stepInfoList: [
            { timestamp: 1445866601, step: 100 },
            { timestamp: 1445876601, step: 120 }
        ]
    })    
})
