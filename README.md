# miniprogram-simulate

[![](https://img.shields.io/npm/v/miniprogram-simulate.svg?style=flat)](https://www.npmjs.com/package/miniprogram-simulate)
[![](https://github.com/wechat-miniprogram/miniprogram-simulate/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/wechat-miniprogram/miniprogram-simulate/actions/workflows/ci.yml?query=branch%3Amaster+)
[![](https://img.shields.io/github/license/wechat-miniprogram/miniprogram-simulate.svg)](https://github.com/wechat-miniprogram/miniprogram-simulate/blob/master/LICENSE)
[![](https://img.shields.io/codecov/c/github/wechat-miniprogram/miniprogram-simulate.svg)](https://app.codecov.io/gh/wechat-miniprogram/miniprogram-simulate)

## 介绍

小程序简易模拟器

本工具可以模拟运行独立的小程序页面或自定义组件，可用于进行组件或页面的单元测试，也可以直接在浏览器环境直接运行

运行此工具集需要依赖 js 运行环境和 dom 环境，因此可以采用 jsdom + nodejs（如 jest），也可以采用真实浏览器环境（如 karma）。文档[使用简介](./docs/tutorial.md)中会提供简单的使用方式介绍。

## 安装

```
npm install --save-dev miniprogram-simulate
```

## 使用

### 单元测试

```js
import path from 'node:path'
import * as simulate from 'miniprogram-simulate'

it('test', () => {
    // 加载自定义组件
    const id = simulate.load(
        path.resolve(__dirname, 'components/comp/index')
    )
    const comp = simulate.render(id) // 渲染自定义组件

    // 使用自定义组件封装实例 comp 对象来进行各种单元测试
    expect(comp.innerHTML).toBe(
        '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
    )
})
```

### 浏览器运行

```bash
# 在 8080 端口开启一个服务
npx miniprogram-simulate -p 8080
```

该命令会在 8080 端口启动一个服务，你可以访问 `localhost:8080/path/to/comp` 来查看组件在浏览器上的渲染结果。注意你需要将 `/path/to/comp` 路径替换为你的组件所在路径.

## 详细文档

* [使用简介](./docs/tutorial.md)
* [接口文档](./docs/api.md)
* [细节实现](./docs/detail.md)
* [暂不支持特性](./docs/todo.md)
* [更新日志](./docs/update.md)

## 协议

[MIT](./LICENSE)
