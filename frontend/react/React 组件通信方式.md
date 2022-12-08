React 组件通信方式

> https://www.php.cn/js-tutorial-471000.html

1、父子props

2、ref，父组件调用子组件方法并传值，即 Instance Methods 实例方法，通过ref拿到实例

3、子组件向父组件通信，调用父组件的方法，在父组件中对数据进行修改

4、跨组件通信Context，Context.Provider & Context.Consumer

	- 多个数据源跨组件通信
	- 单数据源跨组件通信

5、Redux等第三方状态管理库

6、事件冒泡，在父组件的元素上接收到来自子组件元素的点击事件

7、同一个父组件包裹非父子组件实现通信

8、portals

			- Portals的主要应用场景是：当两个组件在react项目中是父子组件的关系，但在HTML DOM里并不想是父子元素的关系。

9、global variable （window）

10、Observer Pattern 观察者模式

 - document.addEventListener('myEvent', this.handleEvent)
 - document.dispatchEvent(new CustomEvent('myEvent', {...}))



---

[Vue组件通信](https://segmentfault.com/a/1190000019208626)

1、props 只能父子通信

2、子$emit 父:on 只能父子通信

3、EventBus 

  -  **通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件**
  -  new Vue() $on $emit $off

4、vuex

	- state
	- getters
	- mutations
	- actions
	- dispatch

5、$attrs / $listeners 不能用于兄弟通信

6、provide / inject 不能用于兄弟通信

7、$parent / $ children  

8、$ref

9、localStorage / sessionStorage



> **组件中的数据共有三种形式：data、props、computed**

> 常见使用场景可以分为三类:
> 父子组件通信: 
>
> - props; $parent / $children; 
> - provide / inject ; 
> - ref ; 
> - $attrs / $listeners
>
> 兄弟组件通信: 
>
> - eventBus ; 
>
> - vuex
>
> 跨级通信: 
>
> - eventBus；
> - Vuex；
> - provide / inject 、
> - $attrs / $listeners