# miniprogram-simulate

[![](https://img.shields.io/npm/v/miniprogram-simulate.svg?style=flat)](https://www.npmjs.com/package/miniprogram-simulate)
[![](https://img.shields.io/travis/wechat-miniprogram/miniprogram-simulate.svg)](https://github.com/wechat-miniprogram/miniprogram-simulate)
[![](https://img.shields.io/npm/l/miniprogram-simulate.svg)](https://github.com/wechat-miniprogram/miniprogram-simulate)
[![](https://img.shields.io/coveralls/github/wechat-miniprogram/miniprogram-simulate.svg)](https://github.com/wechat-miniprogram/miniprogram-simulate)

## 介绍

小程序自定义组件测试工具集。

目前因为小程序独特的运行环境，所以对于小程序自定义组件的单元测试一直没有比较优雅的解决方案，此工具集就是为了解决此痛点而诞生的。将原本小程序自定义组件双线程运行的机制调整成单线程运行，使用 jsdom 来模拟 dom 接口进而进行 dom 树的渲染，借此来完成整个自定义组件树的搭建。

## 安装

```
npm install --save-dev miniprogram-simulate
```

## 使用

```js
const simulate = require('miniprogram-simulate')

const id = simulate.load('/components/comp/index') // 加载自定义组件
const comp = simulate.render(id) // 渲染自定义组件

// 使用自定义组件封装实例 comp 对象来进行各种单元测试
```

以上只是一个简单的例子，实际上这个工具集必须搭配 jest 或 jsdom/mocha 等测试框架来使用，更为详细的使用细节请参阅下述文档：

* [接口文档](./docs/api.md)
* [细节介绍](./docs/detail.md)
* [暂不支持特性](./docs/todo.md)

## 协议

[MIT](./LICENSE)
