const _ = require('./utils')

const compiler = _.getCompiler()
const wxmlCache = {}

module.exports = {
  /**
   * 编译 wxml
   */
  // async compileWxml(globalConfig) {
  //   if (compiler) {
  //     // 使用官方编译器
  //     const compileString = await compiler.wxmlToJs(globalConfig.rootPath)
  //     const compileFunc = new Function(compileString)

  //     globalConfig.wxmlGwx = compileFunc()
  //   }
  // },

  /**
   * 获取 wxml
   */
  async getWxml(componentPath, globalConfig) {
    let wxml = wxmlCache[componentPath]

    if (globalConfig.wxmlGwx) {
      // 存在官方编译器编译结果
      wxml = wxml || _.readFile(`${componentPath}.wxml`)

      // console.log(object.keys(globalConfig.wxmlGwx))
      // 构建编译结果为函数
    } else {
      // 使用纯 js 实现的编译器
      wxml = wxml || _.readFile(`${componentPath}.wxml`)
    }

    // 缓存 wxml 内容
    wxmlCache[componentPath] = wxml

    return wxml
  }
}
