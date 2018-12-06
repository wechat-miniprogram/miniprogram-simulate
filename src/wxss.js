const postcss = require('postcss')

/**
 * 追加 class 前缀插件
 */
const addClassPrefixPlugin = function (prefix = '') {
  return postcss.plugin('addClassPrefix', () => root => {
    root.walk(child => {
      if (child.type === 'rule') {
        const selectors = []

        child.selectors.forEach(selector => {
          // 处理 class 选择器
          selectors.push(selector.replace(/\.([-_a-zA-Z0-9]+)/ig, (all, $1) => `.${prefix}--${$1}`))
        })

        child.selectors = selectors
      }
    })
  })
}

/**
 * 编译 wxss
 */
function compile(component) {
  const { tagName, wxss } = component

  return postcss([addClassPrefixPlugin(tagName)]).process(wxss, {
    from: undefined, // 主要是不想看到那个 warning
    map: null,
  }).css
}

/**
 * 插入 wxss
 */
function insert(wxss, id) {
  // 删除已插入的
  document.querySelectorAll(`style#${id}`).forEach(style => {
    style.parentNode.removeChild(style)
  })

  const style = document.createElement('style')
  style.type = 'text/css'
  style.id = id
  style.innerHTML = wxss.join(''),
  
  document.getElementsByTagName('head').item(0).appendChild(style)
}


module.exports = {
  compile,
  insert,
}
