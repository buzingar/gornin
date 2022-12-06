# 那些年对接过的应用

## 钉钉

https://open.dingtalk.com/document/org/develop-org-h5-micro-applications

`yarn add dingtalk-jsapi`

```js
import { env, ready, runtime } from "dingtalk-jsapi"; // config
import { ENV_ENUM } from "dingtalk-jsapi/lib/env";

// 判断在不在钉钉环境
if (env.platform === ENV_ENUM.notInDingTalk) {
  // 提示 或者 兼容操作
} else {
  dingtalkAuth();
}

const dingtalkAuth = () => {
  // 在开发者后台里配置url，可携带参数
  const { corpId = "ding1ff92aad552e595aa39a90f97fcb1e09" } = query;
  ready(() => {
    runtime.permission
      .requestAuthCode({
        corpId,
      })
      .then(({ code }) => {
        if (code) {
          // 登录接口，获取userInfo
          login(code);
        }
      });
  });
};
```

## WPS

[wps doc](https://wwo.wps.cn/docs/)

[java demo](https://opendemo.ks3-cn-beijing.ksyun.com/sdk-demo-download/weboffice/Java%E7%89%88%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90/wpsweb-java-demo.zip)

![architecture](https://wwo.wps.cn/docs/temp/0e3288a990b27edc67c79df2813ab3df?./img/technical-architecture.png)

[jssdk](https://wwo.wps.cn/docs/update-log/jssdk/)

```js
// 引入 wps js-sdk
import WebOfficeSDK from "./web-office-sdk/web-office-sdk-v1.1.19.es.js";

WebOfficeSDK.config({
  mount: document.querySelector("#wps-viewer"),
  url: "",
  refreshToken: () => Promise.resolve({ token, timeout: 10 * 60 * 1000 }),
});

await this.WpsApp.ready();

this.WpsApp.setToken({ token }); // 授权
this.WpsApp.tokenData = token;

this.WpsApp.ApiEvent.AddApiEventListener("fileOpen", (data) => {
  console.log("open data:", data);
});
const app = await this.WpsApp.Application;
const appDoc = await app.ActiveDocument;
// 显示/不显示文件名栏
// appDoc.SwitchFileName(false);
app.CommandBars("FileName").Visible = false;
app.CommandBars("HeaderRight").Visible = false;
app.CommandBars("HistoryVersion").Visible = true;

appDoc.ActiveWindow.View.Zoom.Percentage = 100;
// 水印对象，第 Index 个代表所选内容、范围或文档中的部分
const waterMarks = appDoc.Sections.Item(1).WaterMarks;
// 删除水印
waterMarks.DeleteWaterMark();
```

## 海康

## 科大讯飞

```js
// 讯飞语音
import IatRecorder from "./xflib/IatRecorder";
Vue.prototype.iatRecorder = new IatRecorder();
```

vue + 科大讯飞语音工具

[vue 移动端使用科大讯飞的语音识别(语音听写)](https://blog.csdn.net/CN_wangsanhua/article/details/120497946)

[另一个案例](https://blog.csdn.net/zyz_3362/article/details/109023354)

一个封装好的科大讯飞的插件 `npm i voice-input-button2 -D`

IatRecorder .js 文件里面 `const transWorker = new Worker()` 就会报错，原因是 vue 里面不能直接使用原生的 `new Worker`，也会跟 webpack 版本有关系。

众所周知，JavaScript 是单线程的，一些复杂比较耗时的操作，会阻塞页面的渲染交互，引起页面卡顿，影响用户体验。web worker 是 html5 的新特性之一，主要就是用来解决此类问题，为页面额外开启一个线程，用来处理一些比较耗时操作，不影响主线程的进行。

其不同模块间的通信主要通过 postMessage 进行消息推送，通过 onmessage 进行消息接收，所以 vue 项目不能直接使用，得配置，而科大讯飞语音官网上给的不是 vue 项目示例，也没有特别说明。

```cmd
// 指定版本
npm install worker-loader@2.0.0 -D
```

```js
module.exports = {
  configureWebpack: (config) => {
    // 添加 worker-loader
    config.module.rules.push({
      test: /\.worker.js$/,
      use: {
        loader: "worker-loader",
        options: { inline: true, name: "workerName.[hash].js" },
      },
    });
  },
  parallel: false, // 处理打包的时候报错
  chainWebpack: (config) => {
    // 控制台会报错，“window is undefined”
    // 因为worker线程中不存在window对象，因此不能直接使用，要用this代替
    config.output.globalObject("this");
  },
};
```

打包成 apk，应用没有主动询问是否开启麦克风权限，需要自己授权。

## 高德

## 百度

## capacitor

https://capacitorjs.com/docs
