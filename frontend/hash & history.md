# 单页面应用
改变url不向服务器发送请求
检测url变化
拦截url，解析出需要的信息来匹配路由规则

# hash 模式
路径带有 #
可实现页面锚点定位，类似于 类选择器，让对应的id元素显示在可视区域
hash改变不会重新加载页面
hash改变不会导致浏览器向服务器发出请求
hash改变会触发hashchange事件
hash传参大小有限制


# history 模式
存放数据更多样，在url中传递参数，或将数据存放在一个特定的对象中
html5新特性，ie8 X
检测是否支持History API (window.hostory && history.pushState)

history.length 保存着历史记录的url数量

## 在浏览器历史中添加修改记录
window.history.pushState(state_obj, new_page_title, new_page_url)
pushState方法不会触发页面刷新，只是导致了history对象发生变化，地址栏会有反应
window.history.replaceState(state, title, url)

window.history.popState事件
window.addEventListener('popstate', function(event) {})
注意：仅仅调用pushState方法或replaceState方法，并不会触发该事件，只有用户点击浏览器后退和前进按钮时，或者使用js调用back、forward、go方法时才会触发。
页面第一次加载的时候，浏览器不会触发popState事件

window.history.state -> state 对象

跳转方法：允许在浏览器历史之间移动
window.history.back()
window.history.forward()
window.history.go()

调用history.pushState()相比于直接修改hash，存在以下优势：
pushState()设置的新的url可以是与当前url同源的任意url，而hash只可修改#后面的部分，因此只能设置与当前url同文档的url
pushState()设置的新的url可以与当前url一摸一样，这样也会把记录添加到栈中；而hash设置的新值必须与原来的不一样才会触发动作将记录添加到栈中
pushState()通过stateObject参数可以添加任意类型的数据到记录中；而hash只可添加短字符串
pushState()可额外设置title属性提供后续使用

## 不足
在用户手动输入url后回车，或者刷新（重启）浏览器的时候，会报一个404的错误，找不到指定路由，需要后端去指向正确的路由匹配, 比如当url不匹配时跳转到index.html.

```nginx
location / {
   try_files $uri $uri/ /index.html;#支持history模式刷新
   root   /www/test/hello/;
   index   index.html;
}
```