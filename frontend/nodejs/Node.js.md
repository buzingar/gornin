# Node.js

# 介绍
> 一说到 Node.js，我们马上就会想到“异步”、“事件驱动”、“非阻塞”、“性能优良”这几个特点



官方Node.js网站给出的定义：“**Node.js是基于Chrome的V8 JavaScript引擎构建的JavaScript运行时**”。
所以，Node.js是一个能够执行JavaScript的服务器。Node.js的核心是一个服务器引擎。它提供异步和事件驱动的API，因此对它的请求作为循环（事件循环）处理，这就是Node.js本质上是**运行时**的原因。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/300273/1585575160919-b8c176b4-d370-44f8-9c2f-7141c0c5a747.png#align=left&display=inline&height=129&name=image.png&originHeight=517&originWidth=1080&size=205181&status=done&style=none&width=270)
Node的诞生，使开发人员可以在前端和后端都使用JavaScript。Node.js包含用于文件file system，套接字socket和HTTP通信的内置异步I/O库。此外，由于Node.js的单线程事件循环体系结构，开发人员还可以更快速，更简单的方式执行**IO密集型操作**（如响应超文本传输协议或HTTP请求）。

Node.js的主要思想是：在面向跨分布式设备运行的**数据密集型**实时应用程序时，使用非阻塞、事件驱动的I/O保持轻量级和高效。
> 在实际的应用环境中，往往有很多 I/O 操作（例如网络请求、数据库查询等等）需要耗费相当多的时间，而 Node.js 能够在等待的同时继续处理新的请求，大大提高了系统的吞吐率。



Node.js的发明者Ryan Dahl表示，受到Gmail等应用程序的启发，他的目标是设计一个用于构建具有实时推送功能的网站的系统。因此，**事件驱动的编程**成为Node.js的核心。

Node.js应用程序被设计为使用非阻塞I/O和异步事件来最大化吞吐量和效率。Node.js应用程序运行单线程，尽管它使用多个线程来处理文件和网络事件。由于其异步性质，Node.js通常用于实时应用程序。
Node.js是一个巨大的JavaScript生态系统，**非常适合实时使用**。为了在内部执行代码，Node.js使用Google V8 JavaScript引擎，大部分基本模块都是用JavaScript编写的。用于HTTP和套接字支持的异步I/O库允许Node.js充当Web服务器，而无需Apache等其他软件。


**Node.js从未被用来解决计算扩展问题，它是为了解决I/O扩展问题**。作为单线程，Node.js可能是用作计算服务器的Web服务器的不良选择，因为大量计算会阻止服务器的响应。如果您的用例不包含CPU升级活动或获取任何阻止资源，您可以利用Node.js的优势并制作快速且适应性强的系统应用程序。


# 带着问题学习

- 浏览器 JavaScript 与 Node.js 的关系与区别
- 了解 Node.js 有哪些全局对象
- 掌握 Node.js 如何导入和导出模块，以及模块机制的原理
- 了解如何用 Node.js 开发简单的命令行应用
- 学会利用 npm 社区的力量解决开发中遇到的难题，避免“重复造轮子”
- 了解 npm scripts 的基本概念和使用
- 初步了解 Node.js 的事件机制



# node入门
运行方式

- REPL
- node abc.js
> REPL 的全称是 Read Eval Print Loop（读取-执行-输出-循环），通常可以理解为交互式解释器



直接给Node传递 `--use_strict` 参数来开启严格模式。
```bash
$ node --use_strict calc.js
```


## 模块
在Node环境中，一个.js文件就称之为一个模块（module）。

### 什么是 Node 模块
通常来说，Node 模块可分为两大类：

- 核心模块：Node 提供的内置模块，在安装 Node 时已经被编译成二进制可执行文件
- 文件模块：用户编写的模块，可以是自己写的，也可以是通过 npm 安装的（后面会讲到）。

其中，文件模块可以是一个单独的文件（以 .js、.node 或 .json 结尾），或者是一个目录。
当这个模块是一个目录时，模块名就是目录名，有两种情况：

1. 目录中有一个 package.json 文件，则这个 Node 模块的入口就是其中 main 字段指向的文件；
1. 目录中有一个名为 index 的文件，扩展名为 .js、.node 或 .json，此文件则为模块入口文件。



### 好处
使用模块有什么好处？

- 最大的好处是大大提高了代码的可维护性。
- 其次，编写代码不必从零开始。当一个模块编写完毕，就可以被其他地方引用。
- 使用模块还可以避免函数名和变量名冲突。相同名字的函数和变量完全可以分别存在不同的模块中。



### CommonJS规范
一个模块想要对外暴露变量（函数也是变量），可以用`module.exports = variable;`，一个模块要引用其他模块暴露的变量，用`var ref = require('module_name');`就拿到了引用模块的变量。


在使用`require()`引入模块的时候，请注意模块的相对路径。
只写一个名称的话，Node会依次在内置模块、全局模块和当前模块下查找。
```javascript
// hello.js
function greet(){};
module.exports = greet;

// main.js
var greet = require("./hello");
greet();
```


### 模块原理
JavaScript语言本身并没有一种模块机制来保证不同模块可以使用相同的变量名。
实现“模块”功能的奥妙就在于JavaScript是一种函数式编程语言，它支持闭包。如果我们把一段JavaScript代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。

请注意我们编写的`hello.js`代码是这样的：
```javascript
var s = 'Hello';
var name = 'world';
console.log(s + ' ' + name + '!');
```


Node.js加载了`hello.js`后，它可以把代码包装一下，变成这样执行：
```javascript
(function () {
    // 读取的hello.js代码:
    var s = 'Hello';
    var name = 'world';
    console.log(s + ' ' + name + '!');
    // hello.js代码结束
})();
```


这样一来，原来的全局变量`s`现在变成了匿名函数内部的局部变量。如果Node.js继续加载其他模块，这些模块中定义的“全局”变量`s`也互不干扰。

#### require函数
require 用于导入其他 Node 模块，其参数接受一个字符串代表模块的名称或路径，通常被称为模块标识符。具体有以下三种形式：

- 直接写模块名称，通常是核心模块或第三方文件模块，例如 os、express 等
- 模块的相对路径，指向项目中其他 Node 模块，例如 ./utils
- 模块的绝对路径（不推荐！），例如 /home/xxx/MyProject/utils
> 在通过路径导入模块时，通常省略文件名中的 .js 后缀。

```javascript
// 导入内置库或第三方模块
const os = require('os');
const express = require('express');

// 通过相对路径导入其他模块
const utils = require('./utils');

// 通过绝对路径导入其他模块
const utils = require('/home/xxx/MyProject/utils');
```


#### exports对象
通过将需暴露的函数添加到 exports 对象中，外面的模块就可以require()使用这个函数。
```javascript
// myModule.js
function add(a, b) {
  return a + b;
}

// 导出函数 add
exports.add = add;

// main.js
const myModule = require('./myModule');
// ES6 解构赋值
// const { add } = require('./myModule');

// 调用 myModule.js 中的 add 函数
myModule.add(1, 2);
// add(1, 2);
```


#### module模块对象
![image.png](https://cdn.nlark.com/yuque/0/2020/png/300273/1585578397165-09b32a11-bb98-4769-9dda-0a61151c6aa0.png#align=left&display=inline&height=478&name=image.png&originHeight=956&originWidth=2244&size=1293897&status=done&style=none&width=1122)
有以下字段：

- id：模块的唯一标识符，如果是被运行的主程序（例如 main.js）则为 .，如果是被导入的模块（例如 myModule.js）则等同于此文件名（即下面的 filename 字段）
- path 和 filename：模块所在路径和文件名
- exports：模块所导出的内容，实际上之前的 exports 对象是指向 module.exports 的引用。例如对于 myModule.js，刚才我们导出了 add 函数，因此出现在了这个 exports 字段里面；而 main.js 没有导出任何内容，因此 exports 字段为空
- parent 和 children：用于记录模块之间的导入关系，例如 main.js 中 require 了 myModule.js，那么 main 就是 myModule 的 parent，myModule 就是 main 的 children（这里和我的感觉正好相反）
- loaded：模块是否被加载，从上图中可以看出只有 children 中列出的模块才会被加载
- paths：这个就是 Node 搜索文件模块的路径列表，Node 会从第一个路径到最后一个路径依次搜索指定的 Node 模块，找到了则导入，找不到就会报错。



模块的输出`module.exports`怎么实现？
Node可以先准备一个对象`module`：
```javascript
// 准备module对象:
var module = {
    id: 'hello',
    exports: {}
};

var load = function (module) {
    // 读取的hello.js代码:
    function greet(name) {
        console.log('Hello, ' + name + '!');
    }
    
    module.exports = greet;
    // hello.js代码结束
    return module.exports;
};

var exported = load(module);

// 保存module:
save(module, exported);
```


可见，变量`module`是Node在加载js文件前准备的一个变量，并将其传入加载函数，我们在`hello.js`中可以直接使用变量`module`原因就在于它实际上是函数的一个参数：
```javascript
module.exports = greet;
```


通过把参数`module`传递给`load()`函数，`hello.js`就顺利地把一个变量传递给了Node执行环境，Node会把`module`变量保存到某个地方。
由于Node保存了所有导入的`module`，当我们用`require()`获取module时，Node找到对应的`module`，把这个`module`的`exports`变量返回，这样，另一个模块就顺利拿到了模块的输出：


```javascript
var greet = require('./hello');
```


**强烈建议****使用****`module.exports = xxx`****的方式来输出模块变量，****直接对****`module.exports`赋值，可以应对任何情况。**
```javascript
module.exports = {
    foo: function () { return 'foo'; }
};

module.exports = function () { return 'foo'; };
```


如果要输出一个键值对象`{}`，可以利用`exports`这个已存在的空对象`{}`，并继续在上面添加新的键值；
```javascript
exports.hello = hello;
exports.foo = function () { return 'foo'; };
```


如果要输出一个函数或数组，必须直接对`module.exports`对象赋值。
```javascript
module.exports.foo = function () { return 'foo'; };
module.exports = function () { return 'foo'; };
```

默认情况下，Node准备的`exports`变量和`module.exports`变量实际上是同一个变量，并且初始化为空对象`{}`, Node默认给你准备了一个空对象`{}`，这样你可以直接往里面加东西。给`exports`赋值是无效的，因为赋值后，`module.exports`仍然是空对象`{}`。


直接写 `exports = add;` 无法导出 add 函数，因为 exports 本质上是指向 module 的 exports 属性的引用，直接对 exports 赋值只会改变 exports，对 module.exports 没有影响。如果你觉得难以理解，那我们用 apple 和 price 类比 module 和 exports：
我们只能通过 apple.price = 1 设置 price 属性，而直接对 price 赋值并不能修改 apple.price。
```javascript
apple = { price: 1 };   // 想象 apple 就是 module
price = apple.price;    // 想象 price 就是 exports
apple.price = 3;        // 改变了 apple.price
price = 3;              // 只改变了 price，没有改变 apple.price
```


### fs
#### 读文件
```javascript
"use strict";

var fs = require("fs");

fs.readFile("./main.js", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});

fs.readFile("/Users/bubu/Pictures/pjbPnc3f7ic.jpg", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    console.log(data.length + "bytes"); // 1226302bytes=1.2MB
  }
});

// 同步读
try {
    var data = fs.readFileSync('sample.txt', 'utf-8');
    console.log(data);
} catch (err) {
    // 出错了
}
```


异步读取时，传入的回调函数接收两个参数，当正常读取时，`err`参数为`null`，`data`参数为读取到的String。当读取发生错误时，`err`参数代表一个错误对象，`data`为`undefined`。这也是Node.js标准的回调函数：第一个参数代表错误信息，第二个参数代表结果。
当读取二进制文件时，不传入文件编码时，回调函数的`data`参数将返回一个`Buffer`对象。在Node.js中，`Buffer`对象就是一个包含零个或任意个字节的数组（注意和Array不同）。


#### 转化
`Buffer`对象可以和String作转换，例如，把一个`Buffer`对象转换成String：
```javascript
// Buffer -> String
var text = data.toString('utf-8');
console.log(text);
```
或者把一个String转换成`Buffer`：
```javascript
// String -> Buffer
var buf = Buffer.from(text, 'utf-8');
console.log(buf);
```


#### 写文件
```javascript
"use strict";

var fs = require("fs");

var data = "Hello Node.js. I am written by fs module.";
fs.writeFile("output.text", data, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("写入成功！");
  }
});

// 同步写
try {
  fs.writeFileSync("output-sync.text", data);
} catch (error) {
  console.log(error);
}
```
`writeFile()`的参数依次为文件名、数据和回调函数。如果传入的数据是String，默认按UTF-8编码写入文本文件，如果传入的参数是`Buffer`，则写入的是二进制文件。回调函数由于只关心成功与否，因此只需要一个`err`参数。
和`readFile()`类似，`writeFile()`也有一个同步方法，叫`writeFileSync()`：


#### stat
```javascript
"use strict";

var fs = require("fs");

fs.stat("./output.text", (err, stat) => {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(stat));
    // 是否是文件:
    console.log('isFile: ' + stat.isFile());
    // 是否是目录:
    console.log('isDirectory: ' + stat.isDirectory());
    if (stat.isFile()) {
      // 文件大小:
      console.log('size: ' + stat.size);
      // 创建时间, Date对象:
      console.log('birth time: ' + stat.birthtime);
      // 修改时间, Date对象:
      console.log('modified time: ' + stat.mtime);
    }
  }
});

var main = fs.statSync("./main.js");
console.log(main);
console.log(main.isDirectory());
```


### stream
流——抽象的数据结构。标准数据流：stdin，标准输出流：stdout。
流的特点是数据是有序的，而且必须依次读取，或者依次写入，不能像Array那样随机定位。
流的事件：`data`事件表示流的数据已经可以读取了，`end`事件表示这个流已经到末尾了，没有数据可以读取了，`error`事件表示出错了。


```javascript
"use strict";

var fs = require("fs");

var rs = fs.createReadStream("./output.txt", "utf-8");

rs.on("data", chunk => {
  console.log(chunk);
});

rs.on("end", () => {
  console.log("end");
});

rs.on("error", err => {
  console.log(err);
});

var ws = fs.createWriteStream("output-stream.txt", "utf-8");
ws.write("aaa.\n");
ws.write("bbb.\n");
ws.write("ccc.\n");
ws.end;

var ws1 = fs.createWriteStream("output-stream.txt");
ws1.write(new Buffer("aaa.\n", "utf-8"));
ws1.write(new Buffer("bbb.\n", "utf-8"));
ws1.write(new Buffer("ccc.\n", "utf-8"));
ws1.end;
```


#### pipe
一个`Readable`流和一个`Writable`流串起来后，所有的数据自动从`Readable`流进入`Writable`流，这种操作叫`pipe`。

在Node.js中，`Readable`流有一个`pipe()`方法，就是用来干这件事的。


```javascript
// pipe
var rsn = fs.createReadStream("./output.txt", "utf-8");
var wsn = fs.createWriteStream("./copied.txt");
rsn.pipe(wsn);
```


默认情况下，当`Readable`流的数据读取完毕，`end`事件触发后，将自动关闭`Writable`流。如果我们不希望自动关闭`Writable`流，需要传入参数：
```javascript
readable.pipe(writable, { end: false });
```


### http
```javascript
("use strict");

// 导入http模块:
var http = require("http");

// 创建http server，并传入回调函数:
var server = http.createServer(function(request, response) {
  // 回调函数接收request和response对象,
  // 获得HTTP请求的method和url:
  console.log(request.method + ": " + request.url);
  // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
  response.writeHead(200, { "Content-Type": "text/html" });
  // 将HTTP响应的HTML内容写入response:
  response.end("<h1>Hello world!</h1>");
});

// 让服务器监听8080端口:
server.listen(8080);

console.log("Server is running at http://127.0.0.1:8080/");
```


file server
```javascript
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || ".");

console.log("Static root dir: " + root);

// 创建服务器:
var server = http.createServer(function(request, response) {
  // 获得URL的path，类似 '/css/bootstrap.css':
  var pathname = url.parse(request.url).pathname;
  // 获得对应的本地文件路径，类似 '/src/www/css/bootstrap.css':
  var filepath = path.join(root, pathname);
  // 获取文件状态:
  fs.stat(filepath, function(err, stats) {
    if (!err && stats.isFile()) {
      // 没有出错并且文件存在:
      console.log("200 " + request.url);
      // 发送200响应:
      response.writeHead(200);
      // 将文件流导向response:
      fs.createReadStream(filepath).pipe(response);
    } else {
      // 出错了或者文件不存在:
      console.log("404 " + request.url);
      // 发送404响应:
      response.writeHead(404);
      response.end("404 Not Found");
    }
  });
});

server.listen(8080);

console.log("Server is running at http://127.0.0.1:8080/");
```


## 内置对象
![image.png](https://cdn.nlark.com/yuque/0/2020/png/300273/1585575974984-1efba796-e04f-4b84-aad2-b3d37d387fa3.png#align=left&display=inline&height=311&name=image.png&originHeight=622&originWidth=1080&size=345595&status=done&style=none&width=540)
可以看到 JavaScript 全局对象可以分为四类：

1. 浏览器专属，例如 window、alert 等等；
1. Node 专属，例如 process、Buffer、__dirname、__filename 等等；
1. 浏览器和 Node 共有，但是实现方式不同，例如 console、setTimeout、setInterval 等；
1. 浏览器和 Node 共有，并且属于 ECMAScript 语言定义的一部分，例如 Date、String、Promise 等；
> console在浏览器和 Node 环境中执行这行代码有什么区别：
> - 在浏览器运行 console.log 调用了 BOM，实际上执行的是 `window.console.log('Hello World!')` 
> - Node 首先在所处的操作系统中创建一个新的进程，然后向标准输出打印了指定的字符串，实际上执行的是 `process.stdout.write('Hello World!\n')` 



### global
在Node.js环境中，也有唯一的全局对象，但不叫`window`，而叫`global`，这个对象的属性和方法也和浏览器环境的`window`不同。


### process
`process`也是Node.js提供的一个对象，它代表当前Node.js进程。
如果我们想要在下一次事件响应中执行代码，可以调用`process.nextTick()`,传入`process.nextTick()`的函数不是立刻执行，而是要等到下一次事件循环。


```javascript
// process.nextTick()将在下一轮事件循环中调用:
process.nextTick(function () {
  console.log('nextTick callback!');
});
console.log('nextTick was set!');

// 程序即将退出时的回调函数:
process.on('exit', function (code) {
  console.log('about to exit with code: ' + code);
});
```


### __filename 和 __dirname
分别代表**当前所运行 Node 脚本的文件路径 **和 **所在目录路径**。
> __filename 和 __dirname 只能在 Node 脚本文件中使用，在 REPL 中是没有定义的。



## 判断JavaScript执行环境
有很多JavaScript代码既能在浏览器中执行，也能在Node环境执行，但有些时候，程序本身需要判断自己到底是在什么环境下执行的，常用的方式就是根据浏览器和Node环境提供的全局变量名称来判断：


```javascript
if (typeof(window) === 'undefined') {
    console.log('node.js');
} else {
    console.log('browser');
}
```


## 通过 process.argv 读取命令行参数
能够获取命令行参数的数组，process.argv 数组的第 0 个元素是 node 的实际路径，第 1 个元素是 args.js 的路径，后面则是输入的所有参数。


## npm
npm scripts 分为两大类：

- 预定义脚本：例如 test、start、install、publish 等等，直接通过 npm <scriptName> 运行，例如 npm test，所有预定义的脚本可查看文档
- 自定义脚本：除了以上自带脚本的其他脚本，需要通过 npm run <scriptName> 运行，例如 npm run custom



## EventEmitter
Node 中的事件都是通过 events 核心模块中的 EventEmitter 这个类实现的。EventEmitter 包括两个最关键的方法：

- on：用来监听事件的发生
- emit：用来触发新的事件
```javascript
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

// 监听 connect 事件，注册回调函数
emitter.on('connect', function (word) {
  console.log(word);
});

// 触发 connect 事件，并且加上一个参数（即上面的 word）
emitter.emit('connect', 'Hello there, connected');
```




## References
[1] Node.js 后端工程师学习路线: https://github.com/tuture-dev/nodejs-roadmap
[2] 《JavaScript语言的历史》: http://javascript.ruanyifeng.com/introduction/history.html
[3] AMD（Asynchronous Module Definition）规范: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
[4] RequireJS: https://requirejs.org/
[5] CommonJS 规范: http://wiki.commonjs.org/wiki/CommonJS
[6] 这篇文章: https://zhuanlan.zhihu.com/p/36358695
[7] 解构赋值: http://es6.ruanyifeng.com/#docs/destructuring
[8] Grunt: http://gruntjs.com/
[9] Gulp: https://gulpjs.com/
[10] Webpack: https://webpack.js.org/
[11] 网站: https://npmjs.com
[12] npm 官方网站: https://npmjs.com
[13] 使用文档: https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
[14] semver: https://semver.org/lang/zh-CN/
[15] 文档: https://docs.npmjs.com/misc/scripts#description
[16] ESLint: http://eslint.cn/
[17] 文档: https://javascript.ruanyifeng.com/nodejs/process.html#toc10
[18] 图雀社区: https://tuture.co/?utm_source=juejin_zhuanlan
[19] 一杯茶的时间，上手 Node.js https://mp.weixin.qq.com/s/67-HjXm1qtBiBPyTr-fp1g
