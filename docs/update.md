# 更新日志

## 1.2.3

* 支持 relations
* 添加 typescript 类型文件
* 添加 jest-snapshot-plugin

## 1.2.2

* 修复 wxss 连续使用 import 单引号串失败的问题

## 1.2.1

* usingComponents 支持绝对路径

## 依赖 j-component 更新 1.2.0

* 更新 miniprogram-exparser 到 2.10.4
* 支持内置 behavior wx://component-export
* 支持内置 behavior wx://form-field-button

## 1.1.3

* 修复节点属性值为 falsely 值被强制转为空字符串的问题

## 1.1.2

* 支持官方编译器外链 wxs 支持
* 组件实例的 dispatchEvent 接口支持触发自定义组件事件

## 1.1.0

* 修复调用 Component 构造器时如果传入 options 会导致 class 前缀化错误的问题

## 1.0.8

* 修复 wxss 处理前缀化时会将小数点也判断为 class 选择器前缀的问题

## 1.0.9

* 补充 karma 测试需要的 ./build.js

## 1.0.7 & 依赖 j-component 更新 1.1.6

* 更新 miniprogram-exparser 到 2.7.7
* 支持 observer

## 1.0.3 & 依赖 j-component 更新 1.1.5 & 依赖 miniprogram-compiler 更新 0.1.1

* 修复自嵌套组件无法渲染的问题

## 1.0.2

* 修复编译器生成结构缺少虚拟节点问题

## 依赖 j-component 更新 1.1.2

* 修复初始传入字符串类型 property 时没有触发 observer 的问题

## 1.0.1 & 依赖 miniprogram-compiler 更新 0.1.0

* 修复子组件路径拼接错误问题

## 1.0.0

* 支持官方编译器，并且默认使用官方编译器进行 wxml 编译

## 0.2.0

* 支持接入 karma 测试（浏览器环境）

## 依赖 j-component 更新 1.0.7

* setData 的回调、事件监听器改为异步触发，以模拟更真实的情况

## 0.1.9

* 自定义组件 wxss 支持 less 编写

## 0.1.8

* 补充 scroll 接口，用于模拟滚动
* 补充部分 wx 对象内置接口支持

## 0.1.7

* 支持 selectorQuery
* 补充部分 wx 对象内置接口支持

## 0.1.5

* 调整 wx 异步接口的 errMsg 字段值
* 补充 this.selectComponent 和 this.selectComponents 接口
* 补充部分 wx 对象内置接口支持

## 0.1.4

* wxss 支持 rpx
* wxss 支持 @import
