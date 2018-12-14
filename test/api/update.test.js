const simulate = require('../../index')

test('getUpdateManager', async () => {
    const updateManager = wx.getUpdateManager()
    let hasUpdate = null
    let isSuccess = null

    updateManager.onCheckForUpdate(res => {
        hasUpdate = res.hasUpdate
    })

    updateManager.onUpdateFailed(() => {
        isSuccess = false
    })

    updateManager.onUpdateReady(() => {
        isSuccess = true
    })

    updateManager.applyUpdate()

    await simulate.sleep(100)

    expect(hasUpdate).toBe(true)
    expect(isSuccess).toBe(true)
})
