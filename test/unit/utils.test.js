const path = require('path')
const fs = require('fs')

const utils = require('../../src/utils')

test('readJson', () => {
    let json = utils.readJson(path.join(__dirname, '../../package.json'))
    expect(typeof json).toBe('object')
    expect(json.name).toBe('miniprogram-simulate')

    json = utils.readJson('./a.json')
    expect(json).toBe(null)

    json = utils.readJson(path.join(__dirname, './utils.test.js'))
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
    expect(utils.transformRpx('width: 123rpx;')).toBe('width: 123px;')
    expect(utils.transformRpx('width: aaarpx;')).toBe('width: aaarpx;')
    expect(utils.transformRpx('width: 123px;')).toBe('width: 123px;')
    expect(utils.transformRpx('width: 12.3rpx;')).toBe('width: 12.3px;')
    expect(utils.transformRpx('width: 0.3rpx;')).toBe('width: 0.3px;')
})

test('browser', () => {
    expect(utils.getEnv()).toBe('nodejs')

    utils.setBrowserEnv()

    const contentPath = path.join(__dirname, './file/content.txt')
    const aPath = path.join(__dirname, './file/a.js')
    const bPath = path.join(__dirname, './file/b.js')
    const cPath = path.join(__dirname, './file/c.js')
    window.__FILE_MAP__ = {
        [contentPath]: fs.readFileSync(contentPath, 'utf8'),
        [aPath]: fs.readFileSync(aPath, 'utf8'),
        [bPath]: fs.readFileSync(bPath, 'utf8'),
        [cPath]: fs.readFileSync(cPath, 'utf8'),
    }

    expect(utils.readFile(contentPath)).toBe('hello june')
    expect(window.require(aPath.slice(0, aPath.length - 3))()).toBe('abc')
    expect(window.require('./a.js')).toBe(null)
    expect(utils.getEnv()).toBe('browser')

    utils.setNodeJsEnv()

    expect(utils.getEnv()).toBe('nodejs')
})

test('getDependenceWxmlAndWxsList', () => {
    // ------------ test -----------
    const componentPath = path.join(__dirname, '../comp10/index')
    const rootPath = path.join(componentPath, '../')
    utils.setNodeJsEnv()
    // 获得依赖的wxml 和 wxs 文件列表
    const res = utils.getDependenceWxmlAndWxs(rootPath, componentPath)
    // console.log('dependenceWxmlAndWxs', res)
    const {wxmlList = [], wxsList = []} = res
    // 检查wxml文件列表
    expect(/index\.wxml$/.test(utils.adapterPath(wxmlList[0]))).toBe(true)
    expect(/comp\/custom-ul\.wxml$/.test(utils.adapterPath(wxmlList[1]))).toBe(true)
    expect(/comp\/custom-li\.wxml$/.test(utils.adapterPath(wxmlList[2]))).toBe(true)
    // 检验wxs文件列表
    expect(/wxs\/util\.wxs$/.test(utils.adapterPath(wxsList[0]))).toBe(true)
    expect(/wxs\/config\.wxs$/.test(utils.adapterPath(wxsList[1]))).toBe(true)
})
