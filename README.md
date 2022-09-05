# mini-vue3

Vue3 源码学习，实现简易 vue3

实现 vue3 中的三大模块：
reactivity(响应式)、runtime(运行时)、compiler(编译)

1. reactivity:

   1. reactive 的实现
   2. ref 的实现
   3. readonly 的实现
   4. computed 的实现
   5. track 依赖收集
   6. trigger 触发依赖
   7. 支持 isReactive
   8. 支持嵌套 reactive
   9. 支持 toRaw
   10. 支持 effect.scheduler
   11. 支持 effect.stop
   12. 支持 isReadonly
   13. 支持 isProxy
   14. 支持 shallowReadonly
   15. 支持 proxyRefs

2. runtime-core:
   1. 支持组件类型
   2. 支持 element 类型
   3. 初始化 props
   4. setup 可获取 props 和 context
   5. 支持 component emit
   6. 支持 proxy
   7. 可以在 render 函数中获取 setup 返回的对象
   8. nextTick 的实现
   9. 支持 getCurrentInstance
   10. 支持 provide/inject
   11. 支持最基础的 slots
   12. 支持 Text 类型节点
   13. 支持 $el api
   14. 支持 watchEffect1.
