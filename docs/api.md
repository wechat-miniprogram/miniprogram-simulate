# 接口

## `loadComponent(componentPath: string): string`
## `loadComponent(componentPath: string, options: LoadOptions): string`
## `loadComponent(componentPath: string, tagName: string, options?: LoadOptions): string`

加载自定义组件，返回 componentId。

### `componentPath: string`

自定义组件所在绝对路径。

### `tagName: string`

当自定义组件被实例化后对应的 dom 节点的标签名和 class 前缀名。如果不传此字段则默认为 main。

### `options: LoadOptions`

组件额外配置

#### `LoadOptions.rootPath?: string`

项目根路径，用于编译组件相关模板，要求组件所有依赖在此目录下，默认取当前组件所在目录作为其值

#### `LoadOptions.usingComponents?: Record<string, string>`

使用到的自定义组件映射表，会将传入组件申明的 usingComponents 覆盖

#### `LoadOptions.componentGenerics?: Record<string, true | { default?: string }>`

使用到的抽象节点映射表，会将传入组件申明的 componentGenerics 覆盖
#### `LoadOptions.componentPlaceholder?: Record<string, string>`

使用到的占位节点映射表，会将传入组件申明的 componentPlaceholder 覆盖

## `loadComponentByDef(staticConfig: ComponentStaticConfig, template: string, definition: ComponentDefinitionParam, tagName?: string, rootPath?: string): string`

通过传入组件对象加载自定义组件，返回 componentId。

### `staticConfig: ComponentStaticConfig`

组件的静态配置，内容为组件的 [`json` 文件内容](TODO).

### `template: string`

组件的模板配置，内容为组件的 `wxml` 文件内容。

### `definition: ComponentDefinitionParam`

组件的配置，内容为调用 [`Component` 构造器的内容](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)。

### `tagName: string`

当自定义组件被实例化后对应的 dom 节点的标签名和 class 前缀名。如果不传此字段则默认为 main。

### `rootPath: string`

项目根路径，用于编译组件相关模板，要求组件所有依赖在此目录下，默认取当前运行目录


## `render(componentId: string, properties?: Record<string, any>): RootComponentWrapper`

渲染自定义组件，返回 [RootComponentWrapper](#class-rootcomponentwrapper)。

### `componentId: string`

调用 `loadComponent` 或 `loadComponentByDef` 返回的 id

### `properties: Record<string, any>`

可选字段，创建组件实例时，由组件接收的初始 properties 对象。

## Class: `ElementWrapper`

节点的包裹对象

### `ElementWrapper#dom: Node | null`

获取节点的实际 dom 节点，若当前为虚拟节点则为 null

### `ElementWrapper#innerHTML: string`

获取节点的 innerHTML

### `ElementWrapper#outerHTML: string`

获取节点的 outerHTML

### `ElementWrapper#dispatchTapEvent(): void`

对节点触发点击事件

### `ElementWrapper#dispatchEvent(type: string, options?: EventInit): void`

对节点触发任意自定义事件

### `ElementWrapper#scrollTo(options: ScrollToOptions): void`
### `ElementWrapper#scrollTo(top: number, left: number): void`

对节点触发滚动

### `ElementWrapper#addEventListener(eventName: string, handler: handler: glassEasel.EventListener<unknown>, options?: glassEasel.EventListenerOptions | boolean): void`

设置事件监听

### `ElementWrapper#removeEventListener(eventName: string, handler: handler: glassEasel.EventListener<unknown>, options?: glassEasel.EventListenerOptions | boolean): void`

移除事件监听

## Class: `ComponentWrapper`

组件节点的包裹对象，继承自 `ElementWrapper`

### `ComponentWrapper#data: Readonly<Record<string, any>>`

组件实例对应的 data 对象

### `ComponentWrapper#instance: ComponentCaller<any, any, any, never>`

组件实例中的 this，通过此字段可以访问组件实例的 methods 等定义段

### `ComponentWrapper#querySelector(selector: string): ElementWrapper | null`

获取符合给定匹配串的第一个节点，返回 [ElementWrapper](#class-elementwrapper) 实例。

### `ComponentWrapper#querySelectorAll(selector: string): (ElementWrapper | null)[]`

获取符合给定匹配串的所有节点，返回 [ElementWrapper](#class-elementwrapper) 实例列表。

### `ComponentWrapper#setData(data: Record<string, unknown>, callback?: () => void)`

调用组件实例的 setData 方法.

### `ComponentWrapper#triggerLifeTime(lifeTime: string, ...args: any[]): void`

触发组件实例的生命周期钩子。

### `ComponentWrapper#triggerPageLifeTime(lifeTime: string, ...args: any[]): void`

触发组件实例中配置的页面的生命周期钩子。

## Class: `RootComponentWrapper`

根组件，继承自 [ComponentWrapper](#class-componentwrapper)。

### `RootComponentWrapper#attach(parent: HTMLElement): void`

将根组件实例挂载在传入的 dom 节点上。

### `RootComponentWrapper#detach(): void`

将根组件实例从父亲 dom 节点上移除。
