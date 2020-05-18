# 框架选择

可搭配大部分流行框架使用，只要其满足 js 运行环境和 dom 环境即可。以下简单介绍下 jest 和 karma：

## jest

1. 安装 jest 和配置参考 [jest 官网](https://jestjs.io/docs/zh-Hans/getting-started)
1. 配置 jest
    ```js
    {
        // jest 是直接在 nodejs 环境进行测试，使用 jsdom 进行 dom 环境的模拟。在使用时需要将 jest 的 `testEnvironment` 配置为 `jsdom`。
        // jest 内置 jsdom，所以不需要额外引入。
        "testEnvironment": "jsdom",
        // 配置 jest-snapshot-plugin 从而在使用 jest 的 snapshot 功能时获得更加适合肉眼阅读的结构
        "snapshotSerializers": ["miniprogram-simulate/jest-snapshot-plugin"]
    }
    ```

具体的 jest 配置例子可参考 [weui-miniprogram 中的配置](https://github.com/wechat-miniprogram/weui-miniprogram/blob/unit-test/jest.config.js)

## karma

karma 可使用浏览器真实环境来运行测试用例，但是因为小程序自定义组件的文件是割裂的，而浏览器环境没有文件系统支持，因此需要做一些特殊处理。

安装 preprocessor：

```
npm install --save-dev karma-dirname-preprocessor karma-filemap-preprocessor karma-webpack
```

配置 karma.conf.js 中的 basePath、files、preprocessors、webpack 字段：

```js
module.exports = function(config) {
    config.set({
        // 其他配置 ......
        basePath: path.resolve(__dirname, './test'), // 被测试组件所在根目录，因为编译器的限制，要求所有被测组件必须在此目录下
        files: [
            'node_modules/miniprogram-simulate/build.js', // 注入 miniprogram-simulate，会在 window 下挂载 simulate 对象
            'test/spec/*.spec.js', // 测试用例
            'src/component/*', // 组件文件，路径尽量不要包含 ../ 或者 ./，不然 wcc 编译器可能识别不了
        ],
        preprocessors: {
            'src/component/*': ['filemap'], // 组件文件使用 filemap 将各个文件内容注入到浏览器，路径尽量不要包含 ../ 或者 ./，不然 wcc 编译器可能识别不了
            'test/spec/*.spec.js': ['webpack', 'dirname'], // 使用 webpack 进行打包，使用 dirname 处理测试用例中的 __dirname 变量
        },
        webpack: {
            optimization: {
                minimize: false, // 不做压缩，方便调试
            },
            node: {
                __dirname: false, // 不注入 __dirname，由 preprocessor 来处理
            },
        },
        // 其他配置 ......
    })
}
```

然后测试用例如下方式来编写（以使用 mocha + chai 的方式为例）：

```js
const path = require('path')
const expect = require('chai').expect

describe('component', () => {
    it ('should run successfully', () => {
        // 此处直接使用 simulate 或者 window.simulate 即可，不需要再做 require

        const id = simulate.load(path.resolve(__dirname, '../src/component/index'))
        const comp = simulate.render(id, {prop: 'index.test.properties'})

        comp.attach(document.body) // 挂载在 body 下面

        expect(simulate.match(comp.dom, '<wx-view class="main--index">index.test.properties</wx-view>')).to.equal(true)
    })
})
```

> PS：在使用 karma 测试时只支持官方编译器编译 wxml 文件，不支持使用 js 模拟的编译器，因此就算在 simulate.load 方法中配置了 `compiler: 'simulate'` 也不会生效。

# 使用指南

以下均**以 miniprogram-simulate + jest 的方式**来介绍。

## 引入测试工具

```js
const simulate = require('miniprogram-simulate')
```

## 起步例子

```js
test('comp', () => {
    const id = simulate.load(path.join(__dirname, './comp')) // 加载自定义组件，返回组件 id
    const comp = simulate.render(id) // 使用 id 渲染自定义组件，返回组件封装实例

    const parent = document.createElement('parent-wrapper') // 创建容器节点
    comp.attach(parent) // 将组件插入到容器节点中，会触发 attached 生命周期

    expect(comp.dom.innerHTML).toBe('<div>123</div>') // 判断组件渲染结果
    // 执行其他的一些测试逻辑

    comp.detach() // 将组件从容器节点中移除，会触发 detached 生命周期
})
```

## 传入初始渲染 props

```js
test('comp', () => {
    // 前略

    const comp = simulate.render(id, {
        propName: 'propValue',
    })
})
```

## 获取数据

```js
test('comp', () => {
    // 前略

    // 判断组件数据
    expect(comp.data).toEqual({
        a: 111,
    })
})
```

## 更新数据

```js
test('comp', () => {
    // 前略

    // 更新组件数据
    comp.setData({
        a: 123,
    })
})
```

## 获取子组件

```js
test('comp', () => {
    // 前略

    const childComp = comp.querySelector('#child-id')
    expect(childComp.dom.innerHTML).toBe('<div>child</div>')
})
```

## 获取子组件列表

```js
test('comp', () => {
    // 前略

    const childrenComp = comp.querySelectorAll('.child-item')
    expect(childrenComp.length).toBe(3)
})
```

## 触发事件

```js
test('comp', () => {
    // 前略

    comp.dispatchEvent('touchstart') // 触发组件的 touchstart 事件
    childComp.dispatchEvent('tap') // 触发子组件的 tap 事件
})
```

## 触发生命周期

```js
test('comp', () => {
    // 前略

    comp.triggerLifeTime('ready') // 触发组件的 ready 生命周期
    childComp.triggerLifeTime('moved') // 触发子组件的 moved 生命周期
})
```

## 获取组件 this

```js
test('comp', () => {
    // 前略

    const that = comp.instance // 注意，此处并不是返回 comp，comp 是在组件实例上再封装了一层的对象，而这里返回的是组件实例，即组件方法定义里的 this

    that.data // 获取组件的 data 对象，这里和 comp.data 拿到的对象是一样的
    that.xxx() // 调用组件 methods 定义段里定义的方法
})
```
