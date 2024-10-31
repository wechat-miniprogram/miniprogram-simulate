# 框架选择

可搭配大部分流行框架使用，只要其满足 js 运行环境和 dom 环境即可。以下简单介绍下 jest 和 karma：

## jest

jest 可以使用 nodejs 在本地运行单元测试

### 1. 安装 jest

安装和配置参考 [jest 官网](https://jestjs.io/docs/zh-Hans/getting-started)
### 2. 配置 jest

在 jest 配置文件中（通常为 `jest.config.js`）设置 [jsdom](https://www.npmjs.com/package/jest-environment-jsdom) 环境

```js
// jest.config.js
{
    "testEnvironment": "jsdom",
}
```
### 3. 编写单元测试

```js
const path = require('node:path')
const simulate = requier('miniprogram-simulate')

it('test', () => {
    // 加载自定义组件，自定义组件在当前的 components/comp/index 目录下
    const id = simulate.load(
        path.resolve(__dirname, 'components/comp/index')
    )
    const comp = simulate.render(id) // 渲染自定义组件

    // 挂载到 body
    comp.attach(document.body)

    // 使用自定义组件封装实例 comp 对象来进行各种单元测试
    expect(comp.innerHTML).toBe(
        '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
    )
    // 使用 jest 的 snapshot 功能可以快速测试
    expect(comp).toMatchSnapshot()

    // 从 body 移除
    comp.detach()
})
```

### 4. 运行 jest
```bash
npx jest
```

具体的 jest 配置例子可参考 [weui-miniprogram 中的配置](https://github.com/wechat-miniprogram/weui-miniprogram/blob/unit-test/jest.config.js)

## karma

karma 可使用浏览器真实环境来运行测试用例。

### 1. 安装 karma

安装和配置参考 [karma 官网](https://karma-runner.github.io/6.4/intro/installation.html)

### 2. 配置 karma

karma 不需要特殊的配置，你可以使用任何你喜欢的 framework。下面是一个示例

```js
const path = require('path')

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: path.resolve(__dirname, 'test'),

    // karma plugins
    plugins: ['karma-jasmine', 'karma-chrome-launcher'],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [{pattern: 'spec/*.spec.js', type: 'module'}],
  })
}
```

### 3. 启动 simulate 服务

在你想要测试的项目下启动 simulate 服务

```bash
# 在 8080 端口开启一个服务
npx miniprogram-simulate -p 8080
```

该命令会在 8080 端口启动一个服务，你可以访问 `localhost:8080/path/to/comp` 来查看组件在浏览器上的渲染结果。注意你需要将 `/path/to/comp` 路径替换为你的组件所在路径.

### 4. 编写单元测试

```js
let simulate

describe('component', () => {
    beforeAll(async () => {
        // 加载 simulate
        simulate = await import(
        "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
        );
    });

    it('should run successfully', () => {
        // 加载自定义组件，自定义组件在当前的 components/comp/index 目录下
        const id = simulate.load('/components/comp/index')
        const comp = simulate.render(id) // 渲染自定义组件

        // 挂载到 body
        comp.attach(document.body)

        // 使用自定义组件封装实例 comp 对象来进行各种单元测试
        expect(comp.innerHTML).toBe(
            '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
        )

        // 从 body 移除
        comp.detach()
    })
})
```

### 5. 运行 karma

```bash
npx karma start
```

# 使用指南

以下均**以 miniprogram-simulate + jest 的方式**来介绍。


## 起步例子

```js
test('comp', () => {
    // 加载自定义组件，自定义组件在当前的 components/comp/index 目录下
    const id = simulate.load(
        path.resolve(__dirname, 'components/comp/index')
    )
    const comp = simulate.render(id) // 渲染自定义组件

    // 挂载到 body
    comp.attach(document.body)

    // 使用自定义组件封装实例 comp 对象来进行各种单元测试
    expect(comp.innerHTML).toBe(
        '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
    )

    // 从 body 移除
    comp.detach()
})
```

## 传入初始渲染 props

```js
test('comp', () => {
    // 加载自定义组件，自定义组件在当前的 components/comp/index 目录下
    const id = simulate.load(
        path.resolve(__dirname, 'components/comp/index')
    )
    const comp = simulate.render(id, {
        propName: 'propValue', // 组件会收到 propName 参数
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
