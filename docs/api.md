# 接口

## behavior(definition)

注册并返回 behavior 对象。

### definition

behavior 定义对象，支持字段和小程序 Behavior 构造器参数一致。

```js
const behavior = simulate.behavior({
    /* 小程序 behavior 支持的定义段 */
});
```

## load(componentPath, tagName) / load(definition)

加载自定义组件，返回 componentId。加载方式有两种，一种是传入自定义组件的路径，另一种是传入自定义组件的定义对象。

### componentPath

自定义组件所在绝对路径。

```js
const id = simulate.load('/path/to/component')
```

### tagName

可选字段，当自定义组件被实例化后对应的 dom 节点的标签名。如果不传此字段则默认为 main。

```js
const id = simulate.load('/path/to/component', 'custom-comp')
const comp = simulate.render(definition)

console.log(comp.dom.tagName) // 此处会输出 CUSTOM-COMP
```

### definition

自定义组件的定义对象，除了小程序本身支持的字段外，额外支持字段如下：

| 属性名 | 类型 | 描述 |
|---|---|---|
| id | String | 可选字段，如果传了此字段，则表明注册为全局组件，其他组件可直接在 template 中使用而无需在 usingComponents 里引入 |
| tagName | String | 可选字段，指定组件对应的 dom 节点的 tagName，默认取 usingComponents 里的定义或组件自身的 id |
| template | String | 组件模板，即组件对应的 wxml 内容 |
| usingComponents | Object | 使用到的自定义组件映射表 |
| behaviors | Array<Behavior> | behavior 的用法和小程序类似 |
| options | Object | 配置对象，支持小程序自定义组件 options 定义段支持的所有字段 |
| options.classPrefix | String | 组件样式的私有化前缀，默认是空串，即没有前缀 |

``` js
simulate.load({
    id: 'view',
    tagName: 'wx-view',
    template: '<div><slot/></div>'
}); 

let childId = simulate.load({
    tagName: 'xxx',
    template: '<view><slot/></view>', // 直接使用全局组件
});

let id = simulate.load({
    template: '<child>123</child>',
    usingComponents: {
        'child': childId, // 声明要使用的组件，传入组件 id
    },
    behaviors: [behavior],
    options: {
        classPrefix: 'xxx',

        /* 其他小程序自定义组件支持的 option，比如 addGlobalClass 等 */
    },

    /* 其他小程序自定义组件支持的定义段，比如 methods 定义段等 */
});
```

## render(componentId, properties)

渲染自定义组件，返回 [RootComponent](#rootcomponent)。

### componentId

调用 [load](#load) 接口返回的 id。

### properties

可选字段，创建组件实例时，由组件接收的初始 properties 对象。

```js
const rootComp = simulate.render(id)
```

## match(dom, html)

检查 dom 节点的内容是否符合给定的 html 结构，通常用于比较渲染结果是否符合预期。

```js
const isMatch = simulate.match(dom, '<view>123</view>')
```

## sleep(timeout)

延迟一定时间执行后续代码，主要用于处理需要等待一定时间才能往后续进行操作的情况。此方法会返回一个 promise 对象。

```js
await simulate.sleep(300) // 等待 300ms 后再继续后续代码的执行
```

## Component

组件。

### 属性

| 属性名 | 类型 | 描述 |
|---|---|---|
| dom | Object | 组件实例对应的 dom 节点 |
| data | Object | 组件实例对应的 data 对象 |
| instance | Object | 组件实例中的 this，通过此字段可以访问组件实例的 methods 等定义段 |

### 方法

#### querySelector(selector)

获取符合给定匹配串的第一个节点，返回 [Component](#component) 实例。

> PS：支持 selector 同小程序自定义组件的 selectComponent 接口

```js
const childComp = comp.querySelector('#a')
```

#### querySelectorAll(selector)

获取符合给定匹配串的所有节点，返回 [Component](#component) 实例列表

> PS：支持 selector 同小程序自定义组件的 selectAllComponents 接口

```js
const childComps = comp.querySelectorAll('.a')
```

#### setData(data, callback)

调用组件实例的 setData 方法.

```js
comp.setData({ text: 'a' }, () => {})
```

#### dispatchEvent(eventName, options)

用于模拟触发该组件实例节点上的事件。

```js
// 触发组件树中的节点事件
comp.dispatchEvent('touchstart', {
  touches: [{ x: 0, y: 0 }],
  changedTouches: [{ x: 0, y: 0 }],
})

// 触发组件树中的节点自定义事件
comp.dispatchEvent('customevent', {
  touches: [{ x: 0, y: 0 }],
  changedTouches: [{ x: 0, y: 0 }],
  /* 其他 CustomEvent 构造器支持的 option */
})
```

#### triggerLifeTime(lifeTime)

触发组件实例的生命周期钩子。

```js
comp.triggerLifeTime('moved')
```

## RootComponent

根组件，继承自 [Component](#component)。亦即是说，所有 Component 支持的属性/接口，RootComponent 都支持。

### 方法

#### attach

将根组件实例挂载在传入的 dom 节点上。

```js
const parent = document.createElement('div')
rootComp.attach(parent)
```

#### detach

将根组件实例从父亲 dom 节点上移除。

```js
rootComp.detach()
```
