const path = require('path')

const utils = require('../../src/utils')

test('readJson', () => {
    let json = utils.readJson(path.join(__dirname, '../../package.json'))
    expect(typeof json).toBe('object')
    expect(json.name).toBe('miniprogram-simulate')

    json = utils.readJson('./a.json')
    expect(json).toBe(null)
})

test('readFile', () => {
    let file = utils.readFile(path.join(__dirname, '../../package.json'))
    file = JSON.parse(file)
    expect(typeof file).toBe('object')
    expect(file.name).toBe('miniprogram-simulate')

    file = utils.readFile('./a.json')
    expect(file).toBe(null)
})

test('transformRpx', () => {
    expect(utils.transformRpx('width: 123rpx;')).toBe('width: 123px;');
    expect(utils.transformRpx('width: aaarpx;')).toBe('width: aaarpx;');
    expect(utils.transformRpx('width: 123px;')).toBe('width: 123px;');
    expect(utils.transformRpx('width: 12.3rpx;')).toBe('width: 12.3px;');
    expect(utils.transformRpx('width: 0.3rpx;')).toBe('width: 0.3px;');
});
