[redux 设计思想](https://www.jianshu.com/p/2eb7a12223ad)

> https://segmentfault.com/a/1190000015367584

redux 用来管理组件间状态

第三方，类比快递



什么条件下使用？

- 同一个 state 需要在多个 Component 中共享
- 需要操作一些全局性的常驻 Component，比如 Notifications，Tooltips 等
- 太多 props 需要在组件树中传递，其中大部分只是为了透传给子组件
- 业务太复杂导致 Component 文件太大，可以考虑将业务逻辑拆出来放到 Reducer 中



> 应用的state统一放在store里面维护，当需要修改state的时候，dispatch一个action给reducer，reducer算出新的state后，再将state发布给事先订阅的组件。
>
> 所有对状态的改变都需要dispatch一个action，通过追踪action，就能得出state的变化过程。整个数据流都是单向的，可检测的，可预测的。当然，另一个额外的好处是不再需要一层一层的传递props了，因为Redux内置了一个发布订阅模块。

![clipboard.png](https://segmentfault.com/img/bVbnAc6?w=638&h=479)



数据流

View中组件的交互动作，创建一个Action，派发dispatch Action，通过Reducers更新state，新state存储在Store中，Store state 改变，重新渲染页面。



- Store 容器，整个应用只有一个Store
- State 状态，数据快照，流动的
- Action 订单，通知state变化
- Dispatch 派发
- Reducer 处理State，在老State的基础上结合Action更新
- store.subscibe() 通知订阅者



React-Redux 将组件分为两大类，UI组件和容器组件。UI组件只负责UI的呈现，而容器组件用来管理数据和事件。



connect方法 —— 将交互与UI结合起来

输入逻辑：外部数据（state对象）转为 UI组件的参数
输出逻辑：用户发出的动作 （Action对象）从UI组件传递出去

```jsx
import { connect } from 'react-redux'

const Comp = connect(
  mapStateToProps,
  mapDispatchToProps
)(UI)
```

connect方法接受两个参数：mapStateToProps 和 mapDispatchToProps ，

- 前者负责输入逻辑，将state映射到 UI组件的参数 props ，

- 后者负责输出逻辑，将用户对UI的操作映射成Action。

- mapStateToProps，一个函数，建立一个 state对象 到UI组件的 props对象 的映射关系！映射到UI组件的props对象上。
  - mapStateToProps 接受参数state，state的字段（state.count）赋值给 count 属性，而count属性是UI组件的 同名参数。
  - mapStateToProps 会定义 Store，每当 state 更新就会自动执行这个方法，那自动执行这个方法怎么就会更新UI呢？UI更新一个来自自身的 `this.state` 变化，还有一个来自 `this.props` 变化都会触发React组件重新render()，而就例子 mapStateToProps 接受 state 的变化从而返回一个 赋值 count属性，而这个属性是对应UI组件的 props对象的映射，props变化自然会带动UI组件的更新。
- mapDispatchToProps 是 connect的第二个参数，也是一个函数（还可以是一个对象）。mapDispatchToProps作为函数，应该返回一个对象，该对象的每个键值对都是一个映射，定义了 UI 组件的参数怎样发出Action。映射到UI组件的props参数上
  - mapDispatchToProps函数接受两个参数，返回一个对象，注意返回对象的属性是对应UI组件的props参数的。UI组件怎么派发一个Action呢？那就是 UI组件调用 `props.increase`  就会执行 dispatch（Action） 操作，从而派发一个Action。

```js
const mapStateToProps = (state) => {
    return {
        count: state.count
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        increase: (...args) => dispatch(actions.increase(...args)),
        decrease: (...args) => dispatch(actions.decrease(...args))
    }
};
```



<Provider> 组件，充当所有UI组件的容器组件



React-Redux 的大致工作原理

UI组件只负责UI部分，只通过props参数拿数据和对外派发数据，而没有多做业务上的逻辑。

业务逻辑和数据呈现交给了容器组件，

UI组件和容器组件是通过 connect() 方法链接的，内部是通过 mapStateToProps 和mapDispatchToProps进行数据传递的。

整个应用的数据都会经过 Store 处理。

![img](https://upload-images.jianshu.io/upload_images/5097635-075759ea1939bd47.png?imageMogr2/auto-orient/strip|imageView2/2/w/663/format/webp)



Redux 异步解决方案 Redux-Thunk

**Redux**：是核心库，功能简单，只是一个单纯的状态机，但是蕴含的思想不简单，是传说中的“百行代码，千行文档”。

**React-Redux**：是跟`React`的连接库，当`Redux`状态更新的时候通知`React`更新组件。

**Redux-Thunk**：提供`Redux`的异步解决方案，弥补`Redux`功能的不足。



[Redux异步解决方案之Redux-Thunk原理及源码解析](https://www.cnblogs.com/dennisj/p/13637411.html)

`Redux-Thunk`最主要的作用是帮你给异步`action`传入`dispatch`，这样你就不用从调用的地方手动传入`dispatch`，从而实现了调用的地方和使用的地方的解耦。

原始的`Redux`里面，`action creator`必须返回`plain object`，而且必须是同步的。但是我们的应用里面经常会有定时器，网络请求等等异步操作，使用`Redux-Thunk`就可以发出异步的`action`



---

Vuex 设计思想

**设计思想**：Vuex 全局维护着一个对象，使用到了单例设计模式。在这个全局对象中，所有属性都是响应式的，任意属性进行了改变，都会造成使用到该属性的组件进行更新。并且只能通过 `commit` 的方式改变状态，实现了单向数据流模式。

- state：存储状态（变量）
- getters：对数据获取之前的再次编译，可以理解为state的计算属性。
- mutations：修改状态，并且是同步的。在组件中使用$store.commit('',params)。这个和我们组件中的自定义事件类似。
- actions：异步操作。在组件中使用是$store.dispatch('')
- modules：store的子模块，为了开发大型项目，方便状态管理而使用的

