TC39、ECMA-262、

---

DOM

映射为一个多层节点结构

文档树，可以轻松地删除、添加、替换或修改任何节点

选择节点：

- document.getElementById()
- document.getElementsByClassName() 等
- document.querySelector()
- document.querySelectorAll()

相关节点：

- node.parentNode()

删除节点：

- removeChild()

插入节点：

- appendChild()
- insertBefore()

更改样式
.classlist
.style

---

script 元素属性

- src
- type
- async，立即下载外部脚本，不阻碍其他操作；（独立 js，立即下载、立即执行）
- defer，立即下载脚本，延迟执行，（文档完全被解析和显示之后）
- charset，代码字符集
- language

脚本按先后顺序执行

浏览器在下载、解析、执行 js 时，会暂停页面的呈现

---

defer 延迟脚本

- 把延迟脚本放在页面底部仍然是最佳选择
- 在现实当中，延迟脚本并不一定会按照顺序执行，也不一定会在 DOMContentLoaded 事件触发前执行，因此最好只包含一个延迟脚本。
- 浏览器遇到</html>标签后再执行

---

async 异步脚本

- 指定 async 属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。
- 建议异步脚本不要在加载期间修改 DOM。
- 异步脚本一定会在页面的 load 事件前执行

---

html 实体

&lt; <

&gt; >

---

doctype 文档模式

影响 css 内容的呈现，也可能会影响 js 的执行

---

严格模式：为 js 定义了一种不同的解析与执行模型

`'use strict';` 编译执行，告诉 js 引擎切换模式

---

我们通常用大写字母表示“硬编码（hard-coded）”的常量。或者，换句话说就是，当值在执行之前或在被写入代码的时候，我们就知道值是什么了。

正确命名变量

- 变量名在能够准确描述变量的同时要足够简洁。
- 使用易读、易懂的命名
- 和团队保持一致

---

typeof

```js
typeof 1;
typeof "a";
typeof true;
typeof undefined;
typeof null; // 'object'
typeof function () {}; // 'function'
typeof { name: "gornin" }; // 'object'
typeof [1, 2, 3]; // 'object'
typeof 123n; // 'bigint'
```

---

Null 类型 与 Undefined 类型

只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存 null 值。这样做不仅可以体现 null 作为空对象指针的惯例，而且也有助于进一步区分 null 和 undefined。

---

Number 类型

IEEE754 格式，浮点数值计算会产生舍入误差的问题，如 0.1 + 0.2 === 0.3 ?

浮点数值的最高精度是 17 位小数，精度丢失

- Number.MAX_VALUE
- Number.MIN_VALUE
- isFinite()
- Number.EPSILON

- 涉及 NaN 的操作都会返回 NaN，（NaN \*\* 0 除外）
- NaN 与任何值都不相等，包括 NaN 本身
- isNaN()

- Number()
- parseInt()
- parseFloat()

在 ECMAScript 5 JavaScript 引擎中，parseInt()已经不具有解析八进制值的能力

指定基数

- parseInt(str, [radix])
- toString(radix)

---

Object 类型

- constructor
- hasOwnProperty()
- isPrototypeOf()
- propertyIsEnumerable()
- valueOf()
- toString()

---

for...in 枚举对象的属性

```js
for (let propName in window) {
  console.log(propName);
}
```

---

with 语句

将代码的作用域设置到一个特定的对象中

在 with 语句的代码块内部，每个变量首先被认为是一个局部变量，而如果在局部环境中找不到该变量的定义，就会查询 location 对象中是否有同名的属性。如果发现了同名属性，则以 location 对象属性的值作为变量的值。

```js
// 使用with语句关联location对象
with (location) {
  var qs = search.substring(1);
  var hostname = hostname;
  var url = href;
}
```

---

函数参数

在函数体内通过 arguments 对象 来访问这个参数数组，类数组

ECMAScript 中的所有参数传递的都是值，不可能通过引用传递参数。

```js
var obj = { name: "gornin", age: 18 };

function changeProp(o) {
  o.name = "kevin";
  o.age = 20;
}

changeProp(obj);
```
