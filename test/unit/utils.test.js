const path = require('path')

const _ = require('../../src/utils')

test('readJson', () => {
    let json = _.readJson(path.join(__dirname, '../../package.json'))
    expect(typeof json).toBe('object')
    expect(json.name).toBe('miniprogram-simulate')

    json = _.readJson('./a.json')
    expect(json).toBe(null)
})

test('readFile', () => {
    let file = _.readFile(path.join(__dirname, '../../package.json'))
    file = JSON.parse(file)
    expect(typeof file).toBe('object')
    expect(file.name).toBe('miniprogram-simulate')

    file = _.readFile('./a.json')
    expect(file).toBe(null)
})

test('transformRpx', () => {
    expect(_.transformRpx('width: 123rpx;')).toBe('width: 123px;');
    expect(_.transformRpx('width: aaarpx;')).toBe('width: aaarpx;');
    expect(_.transformRpx('width: 123px;')).toBe('width: 123px;');
    expect(_.transformRpx('width: 12.3rpx;')).toBe('width: 12.3px;');
    expect(_.transformRpx('width: 0.3rpx;')).toBe('width: 0.3px;');
});
