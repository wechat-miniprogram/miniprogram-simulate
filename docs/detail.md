# 细节

为了尽量模仿出和小程序相似的表现，会对一些细节实现作一些调整。

* [class 前缀化](#class-前缀化)
* [dom 接口模拟](#dom-接口模拟)
* [自定义组件路径](#自定义组件路径)
* [wx 对象](#wx-对象)
* [内置组件](#内置组件)

## class 前缀化

小程序的自定义组件会进行[样式隔离](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)，防止组件间样式相互影响。

样式隔离会通过对 class 进行前缀化处理，因此通过 `innerHTML` 获取到的 html 文本中的 class 属性，通常会带有前缀。

假设自定义组件 comp 的模板为：

```html
<view class="abc">123</view>
```

```js
const comp = simulate.render(simulate.load('/comp'))

// 渲染的 class 结果会带有 main-- 前缀
expect(comp.innerHTML).toBe('<view class="main--abc">123</view>')
```

在调用 [load](./api.md#loadcomponentpath-tagname-options--loaddefinition) 接口时传入 tagName 参数，这样在渲染自定义组件时会使用 tagName 作为 class 的前缀。默认 tagName 为 main，即前缀为 main。

```js
const comp = simulate.render(simulate.load('/comp', 'custom-comp'))

// 渲染的 class 结果会带有 custom-comp-- 前缀
expect(comp.innerHTML).toBe('<view class="custom-comp--abc">123</view>')
```

需要注意的是，当自定义组件里在 usingComponents 里引用了其他自定义组件的时候，是会默认声明 tagName，所以这种情况下都会进行 class 前缀化：

```json
{
    "component": true,
    "usingComponents": {
        "other-comp": "./other"
    }
}
```

```js
// 渲染的 class 结果会带有 other-comp-- 前缀
expect(otherComp.innerHTML).toBe('<view class="other-comp--abc">123</view>')
```

## 根路径

小程序中每个项目有唯一的跟路径，所以需要确保加载一个组件时，组件使用到的组件都是在根路径下：

```js
simulate.load('/comp/index', { rootPath: '/comp' })
```

```json
// /comp/index.json
{
    "component": true,
    "usingComponents": {
        "other-comp": "/comp/other", // 在跟路径下，可以加载
        "invalid-comp": "../invalid", // 超出跟路径，无法加载
    }
}
```

## 自定义组件路径

因为在此测试环境中没有小程序根路径的概念，所以取 load 方法中的 rootPath 参数作为根路径来进行计算，比如下述例子中的 usingComponents 字段：

```json
{
    "component": true,
    "usingComponents": {
        "other-comp": "/components/other"
    }
}
```

这种绝对路径写法的，它会从我们提供的根路径开始寻找对应组件；但是使用相对路径写法，则无需做任何处理：

```json
{
    "component": true,
    "usingComponents": {
        "other-comp": "./other"
    }
}
```

> PS：关于 rootPath 的设置，可查看[此文档](./api.md#options)

## wx 对象

小程序运行环境中会注入一个 wx 对象，上面提供各种接口以供开发使用。但是此测试环境是运行在 nodejs 上，不存在这些接口的底层实现，因此开发者在写测试用例时对于自己将要使用的接口进行模拟，例如：

```js
const simulate = require('miniprogram-simulate');

test('test some', () => {
    wx.xxx = function() {
        // do something
    }

    // 各种测试代码
})
```

对于接口需要返回的数据也可以开发者自行拟定，方便测试各种情况。

## 内置组件

TODO

像官方提供的 view、image 等都是内置组件，目前此测试环境中提供的内置组件都只做普通渲染，未实现任何功能，如果这些内置组件不满足你需求的话，可以自己重写内置组件来覆盖掉此测试环境中提供的内置组件，例如：

```js
simulate.loadGlobal({
    id: 'view',
    tagName: 'wx-view',
    template: '<div class-"wx-view"><slot/></div>',
})
```

这样便可覆盖掉此测试环境中提供的 view 内置组件。
