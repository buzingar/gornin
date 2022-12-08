# [React新的生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

<img src="/Users/bubu/Library/Application Support/typora-user-images/image-20210507194611719.png" alt="image-20210507194611719" style="zoom:50%;" />

React 16之后有三个生命周期被废弃(但并未删除)

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate



目前React 16.4+的生命周期分为三个阶段，分别是挂载阶段、更新阶段、卸载阶段。

### 挂载阶段:

- constructor: 构造函数，最先被执行,我们通常在构造函数里初始化state对象或者给自定义方法绑定this
- getDerivedStateFromProps: static getDerivedStateFromProps(nextProps, prevState),这是个静态方法,当我们接收到新的属性想去修改我们state，可以使用getDerivedStateFromProps
- render: render函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的DOM、React组件、Fragment、Portals、字符串和数字、Boolean和null等内容
- componentDidMount: 组件装载之后调用，此时我们可以获取到DOM节点并操作，比如对canvas，svg的操作，服务器请求，订阅都可以写在这个里面，但是记得在componentWillUnmount中取消订阅

### 更新阶段:

- getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用
- shouldComponentUpdate: shouldComponentUpdate(nextProps, nextState),有两个参数nextProps和nextState，表示新的属性和变化之后的state，返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true,我们通常利用此生命周期来优化React程序性能
- render: 更新阶段也会触发此生命周期
- getSnapshotBeforeUpdate: getSnapshotBeforeUpdate(prevProps, prevState),这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，可以返回null，此生命周期必须与componentDidUpdate搭配使用
- componentDidUpdate: componentDidUpdate(prevProps, prevState, snapshot),该方法在getSnapshotBeforeUpdate方法之后被调用，有三个参数prevProps，prevState，snapshot，表示之前的props，之前的state，和snapshot。第三个参数是getSnapshotBeforeUpdate返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

### 卸载阶段:

- componentWillUnmount: 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除定时器，取消网络请求或清除在 `componentDidMount()` 中创建的订阅，清理无效的DOM元素等垃圾清理工作。

### 异常处理：

- static getDerivedStateFromError: 此生命周期会在渲染阶段后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state。
- componentDidCatch：此生命周期在后代组件抛出错误后被调用。 它接收两个参数：1. error —— 抛出的错误。2. info —— 带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息。componentDidCatch 会在“提交”阶段被调用，因此允许执行副作用。 它应该用于记录错误之类的情况。



# [为什么弃用willxxx？](https://www.zhihu.com/question/278328905/answer/399344422)

- Fiber 架构下，reconciler 会进行多次，reconciler 过程又会调用多次之前的 willxxx ，造成了语意不明确，因此干掉

- 都次调用 willxxx 会导致一些性能安全/数据错乱等问题，因此 Unsafe

- 静态函数 getDerivedStateFromProps ，直接将其函数内的用户逻辑降低几个数量级，减少用户出错，提高性能，符合语意

- getSnapshotBeforeUpdate 替换之前 willxxxx，给想读取 dom 的用户一些空间，强逼用户到 mount 阶段才能操作 dom

- 提高性能，减少 try catch 的使用



# React Hooks

解决了什么问题？

- 存储状态
- 精简代码，因为不用es6的class定义，不用babel
- 逻辑复用，逻辑聚合

有哪些hooks？是否了解其原理？



**不要在循环，条件或者嵌套函数中调用 Hook**？



hooks的缺点？

- 依赖链，响应式的useEffect
- hooks不擅长异步的代码
- custom hooks有时严重依赖参数的不可变性

