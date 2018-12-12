/**
 * 封装 wx 异步接口为 promise
 */
function wa(func, args = {}) {
    return new Promise((resolve, reject) => {
        let info = null

        func({
            ...args,
            success(res) {
                info = res
            },
            fail(res) {
                info = res
            },
            complete(res) {
                expect(res).toEqual(res)
                resolve(res)
            }
        })
    })
}

module.exports = {
    wa,
}
