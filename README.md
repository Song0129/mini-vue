# mini-vue3

Vue3 源码学习，实现简易 vue3

实现 vue3 中的三大模块：
reactivity(响应式)、runtime(运行时)、compiler(编译)

## reactivity:

- reactive 的实现
- ref 的实现
- readonly 的实现
- computed 的实现
- track 依赖收集
- trigger 触发依赖
- 支持 isReactive
- 支持嵌套 reactive
- 支持 toRaw
- 支持 effect.scheduler
- 支持 effect.stop
- 支持 isReadonly
- 支持 isProxy
- 支持 shallowReadonly
- 支持 proxyRefs

## runtime-core:

- 支持组件类型
- 支持 element 类型
- 初始化 props
- setup 可获取 props 和 context
- 支持 component emit
- 支持 proxy
- 可以在 render 函数中获取 setup 返回的对象
- nextTick 的实现
- 支持 getCurrentInstance
- 支持 provide/inject
- 支持最基础的 slots
- 支持 Text 类型节点
- 支持 $el api
- 支持 watchEffect1.

## compiler-core

- 解析插值
- 解析 element
- 解析 text

## runtime-dom

- 支持 custom renderer

## runtime-test

- 支持测试 runtime-core 的逻辑

## infrastructure

- support monorepo with pnpm
