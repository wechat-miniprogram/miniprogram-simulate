# 使用指南

以下均以 miniprogram-simulate + jest 的方式来介绍。

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
