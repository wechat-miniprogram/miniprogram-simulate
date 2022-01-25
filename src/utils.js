const path = require('path')

const compilerName = 'miniprogram-compiler' // 为了在 webpack 构建打包时不被分析出此依赖
let env = 'nodejs'
let fs = null
let compiler = null
let runJs = null // 执行 js
const dependenceComponentMap = new Map()
const dependenceWxsMap = new Map()

/**
 * 获取当前环境
 */
function getEnv() {
    return env
}

/**
 * 设置 nodejs 环境
 */
function setNodeJsEnv() {
    env = 'nodejs'
    fs = require('fs')
    // eslint-disable-next-line import/no-dynamic-require
    compiler = require(compilerName)
    runJs = filePath => {
        // eslint-disable-next-line import/no-dynamic-require
        require(filePath)
        delete require.cache[require.resolve(filePath)]
    }
}

/**
 * 设置浏览器环境
 */
function setBrowserEnv() {
    env = 'browser'
    fs = {
        readFileSync(filePath) {
            const fileMap = window.__FILE_MAP__ || {}
            if (fileMap[filePath]) {
                return fileMap[filePath]
            } else if (filePath[0] === '/') {
                // path.resolve 可能会加上 /，在 windows 下会有问题
                return fileMap[filePath.substr(1)] || null
            }

            return null
        }
    }
    window.require = runJs = filePath => {
        const content = fs.readFileSync(filePath + '.js')
        if (content) {
            // eslint-disable-next-line no-new-func
            const func = new Function('require', 'module', content)
            const mod = {exports: {}} // modules

            func.call(null, relativePath => {
                const realPath = path.join(path.dirname(filePath), relativePath)
                return window.require(realPath)
            }, mod)

            return mod.exports
        }

        return null
    }
}

try {
    if (typeof global === 'object' && typeof process === 'object') {
        // nodejs
        setNodeJsEnv()
    } else {
        // 浏览器
        setBrowserEnv()
    }
} catch (err) {
    // 浏览器
    setBrowserEnv()
}

/**
 * 读取文件
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8')
    } catch (err) {
        return null
    }
}

/**
 * 读取 json
 */
function readJson(filePath) {
    try {
        const content = readFile(filePath)
        return JSON.parse(content)
    } catch (err) {
        return null
    }
}

/**
 * 转换 rpx 单位为 px 单位
 */
function transformRpx(style) {
    return style.replace(/(\d+)rpx/ig, '$1px')
}

/**
 * 获取 wxml、wxss 编译器
 */
function getCompiler() {
    return compiler
}

/**
 * 获取随机 id
 */
let seed = +new Date()
const charString = 'abcdefghij'
function getId() {
    const id = ++seed
    return id.toString().split('').map(item => charString[+item]).join('')
}

/**
 * 判断是否是绝对路径
 */
function isAbsolute(input) {
    if (typeof input !== 'string') return false
    if (!input.length) return false

    return /^(\/|\\|([a-zA-Z]:[/\\]))/.test(input)
}
/** 适配Linux 和 window路径 */
function adapterPath(filePath) {
    return filePath.split(path.sep).join('/')
}
/**
 * 数组B 加到数组A
 */
function addListB2A(listA, listB) {
    if (!Array.isArray(listA) || !Array.isArray(listB)) {
        return
    }

    listB.forEach((item) => {
        if (!item || listA.indexOf(item) >= 0) {
            return
        }
        listA.push(item)
    })
}
/**
 * 根据wxs文件找到依赖的wxs文件内容
 * @param {*} wxsPath
 * @returns
 */
function getDependenceWxsListByWxsPath(wxsPath) {
    // 检查是否有缓存
    if (dependenceWxsMap.has(wxsPath)) {
        return dependenceWxsMap.get(wxsPath)
    }
    const wxsList = []
    dependenceComponentMap.set(wxsPath, wxsList)
    let wxsStr = ''
    try {
        // 读取wxs 文件内容
        wxsStr = fs.readFileSync(wxsPath, {encoding: 'utf8'})
        // 文件存在则加入
        wxsList.push(wxsPath)
    } catch (error) {
        // 文件不存在的情况 则忽略，因为我没忽略注释内容
        console.log('wxsPath not exist', wxsPath)
    }
    // 需要引用类型
    wxsStr.replace(/require\(['"](.*?)['"]\)/g, (all, $1) => {
        const denpendenceWxsPath = path.join(wxsPath, '../', $1)
        const dependenceWxsList = getDependenceWxsListByWxsPath(denpendenceWxsPath)
        addListB2A(wxsList, dependenceWxsList)
    })
    return wxsList
}

/**
 * 获取依赖wxml和wxs文件
 */
function getDependenceWxmlAndWxs(rootPath, componentPath) {
    // 先判断缓存，如果存在缓存， 则直接返回
    if (dependenceComponentMap.has(componentPath)) {
        return dependenceComponentMap.get(dependenceComponentMap)
    }
    const wxmlList = []
    const wxsList = []
    const res = {
        wxmlList,
        wxsList
    }
    dependenceComponentMap.set(compiler, res)
    // json文件路径
    const jsonPath = componentPath + '.json'
    // wxml 文件路径
    const wxmlPath = componentPath + '.wxml'
    // 加入wxml列表
    wxmlList.push(wxmlPath)
    // 读取json字符串
    let jsonStr = '{}'
    try {
        jsonStr = fs.readFileSync(jsonPath, {encoding: 'utf8'})
    } catch (error) {
        // ignore
    }
    // 转换为对象
    const jsonObj = JSON.parse(jsonStr)
    // 读取对象的usingComponent { compa: "./compa/compa"}
    const usingComponents = jsonObj.usingComponents || {}
    // 遍历依赖的组件
    Object.keys(usingComponents).forEach(tag => {
        let dependenceComponentPath = usingComponents[tag]
        // 判断是不是相对文件路径 因为有两种写法： /page/compa 和 ./compa
        // 找到依赖组件的绝对文件路径
        if (isAbsolute(dependenceComponentPath)) {
            dependenceComponentPath = path.join(rootPath, '.' + dependenceComponentPath)
        } else {
            dependenceComponentPath = path.join(componentPath, dependenceComponentPath)
        }
        // 递归寻找依赖的wxml 和 wxs
        const {wxmlList: dependenceWxmlList = [], wxsList: dependenceWxsList = []} = getDependenceWxmlAndWxs(rootPath, dependenceComponentPath)
        addListB2A(wxmlList, dependenceWxmlList)
        addListB2A(wxsList, dependenceWxsList)
    })
    // 分析wxml 引用的wxs文件列表
    let wxmlStr = ''
    try {
        wxmlStr = fs.readFileSync(wxmlPath, {encoding: 'utf8'})
        // 最保险还是要语法分析，但是语法分析会比较耗时
        wxmlStr.replace(/(?:<wxs\s+module="(?:.*?)"\s+src="(.*?)"((>(.*?)<\/wxs>)|\/>))|(?:<wxs\s+src="(.*?)"\s+module="(.*?)"((>(.*?)<\/wxs>)|\/>))/g, (all, $1) => {
            const dependWxsPath = path.join(componentPath, '../', $1)
            const denpendWxsList = getDependenceWxsListByWxsPath(dependWxsPath)
            addListB2A(wxsList, denpendWxsList)
        })
    } catch (error) {
        // 文件不存在的错误忽略
    }


    return res
}

module.exports = {
    getEnv,
    setNodeJsEnv,
    setBrowserEnv,
    runJs,
    readFile,
    readJson,
    transformRpx,
    getCompiler,
    getId,
    isAbsolute,
    getDependenceWxmlAndWxs,
    adapterPath
}
