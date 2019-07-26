/**
 * 封装 wx 异步接口为 promise
 */
function wa(func, args = {}) {
    return new Promise(resolve => {
        func({
            ...args,
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
