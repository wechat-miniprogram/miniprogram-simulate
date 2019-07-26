const simulate = require('../../index')

test('error', () => {
    let catchErr = null
    try {
        simulate.load(123)
    } catch (err) {
        catchErr = err
    }
    expect(catchErr.message).toBe('componentPath must be a string')

    catchErr = null
    try {
        simulate.load('./index')
    } catch (err) {
        catchErr = err
    }
    expect(catchErr.message).toBe('invalid componentPath: ./index')

    catchErr = null
    try {
        simulate.behavior('./index')
    } catch (err) {
        catchErr = err
    }
    expect(catchErr.message).toBe('definition must be a object')

    catchErr = null
    try {
        simulate.render()
    } catch (err) {
        catchErr = err
    }
    expect(catchErr.message).toBe('you need to pass the componentId')

    expect(simulate.render(123)).toBe(undefined)
    expect(simulate.match(null)).toBe(false)

    catchErr = null
    try {
        simulate.scroll()
    } catch (err) {
        catchErr = err
    }
    expect(catchErr.message).toBe('invalid params')
})
