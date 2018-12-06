const simulate = require('../../index')

test('sleep', async () => {
    let start = +new Date()
    await simulate.sleep(50)
    expect(+new Date() - start >= 50).toBe(true)

    start = +new Date()
    await simulate.sleep(100)
    expect(+new Date() - start >= 100).toBe(true)

    start = +new Date()
    await simulate.sleep()
    expect(+new Date() - start >= 0).toBe(true)
})