const path = require('path')

const _ = require('../../src/utils')

test('utils: readJson', () => {
    let json = _.readJson(path.join(__dirname, '../../package.json'))
    expect(typeof json).toBe('object')
    expect(json.name).toBe('miniprogram-simulate')

    json = _.readJson('./a.json')
    expect(json).toBe(null)
})

test('utils: readFile', () => {
    let file = _.readFile(path.join(__dirname, '../../package.json'))
    file = JSON.parse(file)
    expect(typeof file).toBe('object')
    expect(file.name).toBe('miniprogram-simulate')

    file = _.readFile('./a.json')
    expect(file).toBe(null)
})
