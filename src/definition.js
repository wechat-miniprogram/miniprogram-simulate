const jComponent = require('j-component')

const api = require('./api')
const _ = require('./utils')

module.exports = function () {
  // 注册内置组件
  const officialTagList = _.getOfficialTagList()
  officialTagList.forEach(name => {
    jComponent.register({
      id: name,
      tagName: `wx-${name}`,
      template: '<slot/>',
    })
  })

  // 注入 api
  global.wx = api
}
