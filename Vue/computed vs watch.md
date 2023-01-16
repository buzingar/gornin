computed vs watch



computed 计算属性

- 变量不会定义到data里
- 适合大计算量优化，依赖的条件变化才会重新计算，性能优化
- 多个依赖计算得出一个值
- 不支持异步
- 变量收敛



watch 侦听属性

- 监听data里的变量或props里的变量
- 适合监听一个值前后的变化，更适合一对多的情况，一个属性变化导致很多其他的变化

- 支持异步
- 接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值
- 变量发散



```js
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即执行handler方法
    immediate: true,
    // 深入观察,性能开销大，会深度遍历
    deep: true,
  }
}
```

