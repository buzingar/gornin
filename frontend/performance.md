# Performance

允许网页访问某些函数来测量网页和 Web 应用程序的性能

- 首先，Performance 是一个标准，用于解决开发者在浏览器中获取性能数据的问题。
- 其次，Performance 是一个浏览器全局对象，提供了一组 API 用于编程式地获取程序在某些节点的性能数据。它包含一组高精度时间定义，以及配套的相关方法。

## window.performance

```JavaScript
window.performance

{
    "timeOrigin": 16600216-59942.9,
    // PerformanceTiming
    "timing": {
        "navigationStart": 16600216-59942, // 同一个浏览器上下文中，上一个文档卸载结束的 UNIX 时间戳，有可能与fetchStart相同

        "fetchStart": 16600216-59945, // 浏览器准备好用 HTTP 请求来获取文档的 UNIX 时间戳

        "domainLookupStart": 16600216-59945, // 域名查询开始的 UNIX 时间戳
        "domainLookupEnd": 16600216-59945, // 域名查询结束的 UNIX 时间戳

        "connectStart": 16600216-59945, // HTTP 请求开始向服务器发送时的 UNIX 时间戳
        "connectEnd": 16600216-59945 // 浏览器与服务器之间的连接建立（即握手与认证等过程全部结束）的 UNIX 时间戳
        "secureConnectionStart": 0, // 浏览器与服务器开始安全链接的握手时的 UNIX 时间戳

        "requestStart": 16600216-59993, // 浏览器向服务器发送 HTTP 请求时的 UNIX 时间戳
        "responseStart": 16600216-60818, // 浏览器从服务器收到（或从本地缓存读取）第一个字节时的 UNIX 时间戳

        "redirectStart": 0, // 第一个 HTTP 重定向开始时的 UNIX 时间戳
        "redirectEnd": 0, // 最后一个 HTTP 重定向完成时（即最后一个 HTTP 响应的最后一个比特被接收到的时间）的 UNIT 时间戳

        "domLoading": 16600216-60827, // 当前网页 DOM 结构开始解析时（即 Document.readyState 属性变为 loading，相应的 readystatechange 事件触发时）的 UNIX 时间戳
        "responseEnd": 16600216-60835, // 浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭的时间）的 UNIX 时间戳

        "domInteractive": 16600216-61274, // 当前网页 DOM 结构解析结束，开始加载内嵌资源时（即 Document.readyState 的属性为 interactive，相应的 readystatechange 事件触发时）的 UNIX 时间戳

        "domContentLoadedEventStart": 16600216-61444, // 解析器触发 DomContentLoaded 事件，即所有需要被执行的脚本已经被解析时的 UNIX 时间戳
        "domContentLoadedEventEnd": 16600216-61469, // 所有需要被执行的脚本均已被执行完成时的 UNIX 时间戳
        "domComplete": 16600216-64679, // 文档解析完成，即 Document.readyState 变为 complete 且相应的 readystatechange 事件被触发时的 UNIX 时间戳
        "loadEventStart": 16600216-64681, // 该文档下，load 事件被触发的 UNIX 时间戳
        "loadEventEnd": 16600216-64682, // 该文档下，load 事件结束，即加载事件完成时的 UNIX 时间戳，如果事件未触发或未完成，值为 0。
        "unloadEventStart": 0,
        "unloadEventEnd": 0, // unload 事件抛出时的 UNIX 时间戳
    },
    "navigation": {
        "type": 0,
        "redirectCount": 0
    }
}
```

## 性能节点

- `navigationStart ~ unloadEventEnd` 上一页面的卸载耗时

- `fetchStart ~ domainLookupStart` 查询 app DNS 缓存耗时

- `domainLookupStart ~ domainLookupEnd` dns 查询耗时

- `connectStart ~ connectEnd` TCP 连接耗时

- `connectEnd ~ secureConnectionStart` 针对 https 协议，在 tcp 握手后，传输真正的内容前，建立安全连接的耗时

- `fetchStart ~ responseStart` TTFB（time to first byte）, 即首包时长（从用户代理发出第一个请求开始，到页面读取到第一个字节的耗时）。在一个 web 程序中，用户代理发送的第一个 get 请求一般是 index.html，即接收到这个 html 文件的第一个字节的耗费时间

- `responseStart ~ responseEnd` 内容响应时长

- `domLoading ~ domInteractive` dom 解析完成，即 DOM 树构建完成的时长

- `fetchStart ~ domContentLoadedEventEnd` html 加载完成时间，此时 DOM 已经解析完成

- `domContentLoadedEventEnd ~ loadEventStart` 渲染时长，domContentLoaded 表示 DOM，CSSOM 均准备就绪（CSSOM 就绪意味着没有样式表阻止 js 脚本执行），开始构建渲染树

- `navigationStart ~ domLoading` FPT（first paint time）, 即首次渲染时间，或<b style="color:#ff0000">白屏时间</b>，从用户打开页面开始，到第一次渲染出可见元素为止

- `navigationStart ~ domInteractive` TTI（time to interact），首次可交互时间

- `navigationStart ~ loadEventStart` 页面完全加载完成的时间

## api

### performance.now()

performance.navigationStart 至当前的毫秒数

```JavaScript
let st = performance.now();
for (let o = 0; o < 10000; o ++){
  // console.log(o)
}
let end = performance.now();

console.log(`for时间:${end - st}`); // for时间1155.9950000373647
```

### performance.navigation

负责纪录用户行为信息，只有两个属性。

- type：表示网页的加载来源，可能有 4 种情况

  - 0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数
  - 1：网页通过“重新加载”按钮或者 location.reload()方法加载
  - 2：网页通过“前进”或“后退”按钮加载
  - 255：任何其他来源的加载

- redirectCount：表示当前网页经过了多少次重定向跳转

### performance.timing

```javascript
window.onload = function () {
  const timing = performance.timing;
  console.log(
    "准备新页面时间耗时: ",
    timing.fetchStart - timing.navigationStart
  );
  console.log(
    "redirect 重定向耗时: ",
    timing.redirectEnd - timing.redirectStart
  );
  console.log("Appcache 耗时: ", timing.domainLookupStart - timing.fetchStart);
  console.log(
    "unload 前文档耗时: ",
    timing.unloadEventEnd - timing.unloadEventStart
  );
  console.log(
    "DNS 查询耗时: ",
    timing.domainLookupEnd - timing.domainLookupStart
  );
  console.log("TCP连接耗时: ", timing.connectEnd - timing.connectStart);
  console.log("request请求耗时: ", timing.responseEnd - timing.requestStart);
  console.log("白屏时间: ", timing.responseStart - timing.navigationStart);
  console.log(
    "请求完毕至DOM加载: ",
    timing.domInteractive - timing.responseEnd
  );
  console.log("解析DOM树耗时: ", timing.domComplete - timing.domInteractive);
  console.log(
    "从开始至load总耗时: ",
    timing.loadEventEnd - timing.navigationStart
  );
};
```

### performance.getEntries()

performance.getEntries 方法以数组形式，返回一个 PerformanceEntry 列表，这些请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。

- name：资源名称，资源的绝对路径或调用
- mark：方法自定义的名称
- startTime：开始时间
- duration：加载时间
- entryType：资源类型，
- entryType：类型不同数组中的对象结构也不同
- initiatorType：谁发起的请求

```json
{
  "name": "https://juejin.cn/post/6844904000949600264",
  "entryType": "navigation",
  "startTime": 0,
  "duration": 3062.7000000029802,
  "initiatorType": "navigation",
  "nextHopProtocol": "h2",
  "workerStart": 0,
  "redirectStart": 0,
  "redirectEnd": 0,
  "fetchStart": 1.4000000059604645,
  "domainLookupStart": 1.4000000059604645,
  "domainLookupEnd": 1.4000000059604645,
  "connectStart": 1.4000000059604645,
  "connectEnd": 1.4000000059604645,
  "secureConnectionStart": 1.4000000059604645,
  "requestStart": 11.5,
  "responseStart": 868.5,
  "responseEnd": 895.3000000044703,
  "transferSize": 51127,
  "encodedBodySize": 50827,
  "decodedBodySize": 281969,
  "serverTiming": [
    {
      "name": "inner",
      "duration": 709,
      "description": ""
    },
    {
      "name": "pp",
      "duration": 147,
      "description": ""
    },
    {
      "name": "total",
      "duration": 698,
      "description": "Nuxt Server Time"
    }
  ],
  "workerTiming": [],
  "unloadEventStart": 904.6000000014901,
  "unloadEventEnd": 908.1000000014901,
  "domInteractive": 1347.6000000014901,
  "domContentLoadedEventStart": 1512.4000000059605,
  "domContentLoadedEventEnd": 1543.6000000014901,
  "domComplete": 3059.7000000029802,
  "loadEventStart": 3061.5,
  "loadEventEnd": 3062.7000000029802,
  "type": "reload",
  "redirectCount": 0
}
```

## 首屏时间

首屏时间：也称用户完全可交互时间，即整个页面首屏完全渲染出来，用户完全可以交互，一般首屏时间小于页面完全加载时间，该指标值可以衡量页面访问速度

白屏时间：首次渲染时间，指页面出现第一个文字或图像所花费的时间

白屏时间是小于首屏时间的

### 常见计算方式

- 用户自定义打点—最准确的方式（只有用户自己最清楚，什么样的时间才算是首屏加载完成），缺点：侵入业务，成本高
- 粗略的计算首屏时间: loadEventEnd - fetchStart/startTime 或者 domInteractive - fetchStart/startTime
- 通过计算首屏区域内的所有图片加载时间，然后取其最大值
- 利用 MutationObserver 接口，监听 document 对象的节点变化

## 参考

https://juejin.cn/post/6973567030528065573

https://juejin.cn/post/6844904000949600264

https://juejin.cn/post/7035647196510814221

https://juejin.cn/post/7031572366341701663
