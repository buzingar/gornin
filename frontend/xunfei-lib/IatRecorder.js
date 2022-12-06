/**
 * Created by lycheng on 2019/8/1.
 *
 * 语音听写流式 WebAPI 接口调用示例 接口文档（必看）：https://doc.xfyun.cn/rest_api/语音听写（流式版）.html
 * webapi 听写服务参考帖子（必看）：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=38947&extra=
 * 语音听写流式WebAPI 服务，热词使用方式：登陆开放平台https://www.xfyun.cn/后，找到控制台--我的应用---语音听写---个性化热词，上传热词
 * 注意：热词只能在识别的时候会增加热词的识别权重，需要注意的是增加相应词条的识别率，但并不是绝对的，具体效果以您测试为准。
 * 错误码链接：
 * https://www.xfyun.cn/doc/asr/voicedictation/API.html#%E9%94%99%E8%AF%AF%E7%A0%81
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * 语音听写流式WebAPI 服务，方言或小语种试用方法：登陆开放平台https://www.xfyun.cn/后，在控制台--语音听写（流式）--方言/语种处添加
 * 添加后会显示该方言/语种的参数值
 */

// 1. websocket连接：判断浏览器是否兼容，获取websocket url并连接，这里为了方便本地生成websocket url
// 2. 获取浏览器录音权限：判断浏览器是否兼容，获取浏览器录音权限，
// 3. js获取浏览器录音数据
// 4. 将录音数据处理为文档要求的数据格式：采样率16k或8K、位长16bit、单声道；该操作属于纯数据处理，使用webWork处理
// 5. 根据要求（采用base64编码，每次发送音频间隔40ms，每次发送音频字节数1280B）将处理后的数据通过websocket传给服务器，
// 6. 实时接收websocket返回的数据并进行处理

// ps: 该示例用到了es6中的一些语法，建议在chrome下运行

import CryptoJS from "crypto-js";
import TransWorker from "./transcode.worker.js";

const transWorker = new TransWorker();

let startTime = "";
let endTime = "";

// APPID，APISecret，APIKey在控制台-我的应用-语音听写（流式版）页面获取
const APPID = ""; // 在科大讯飞控制台中获取的服务接口认证信息
const API_SECRET = ""; // 在科大讯飞控制台中获取的服务接口认证信息
const API_KEY = ""; // 在科大讯飞控制台中获取的服务接口认证信息

/**
 * 获取websocket url
 * 该接口需要后端提供，这里为了方便前端处理
 */
function getWebSocketUrl() {
  return new Promise((resolve) => {
    // 请求地址根据语种不同变化
    let url = "wss://iat-api.xfyun.cn/v2/iat";
    let host = "iat-api.xfyun.cn";
    let apiKey = API_KEY;
    let apiSecret = API_SECRET;
    let date = new Date().toGMTString();
    let algorithm = "hmac-sha256";
    let headers = "host date request-line";
    let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    let signature = CryptoJS.enc.Base64.stringify(signatureSha);
    let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    let authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    resolve(url);
  });
}

class IatRecorder {
  constructor({ language = "zh_cn", accent = "mandarin", appId = APPID } = {}) {
    let self = this;
    this.status = "null";
    this.language = language; // || "zh_cn";
    this.accent = accent; // || "mandarin";
    this.appId = appId; // || APPID;
    // 记录音频数据
    this.audioData = [];
    // 记录听写结果
    this.resultText = "";
    // wpgs下的听写结果需要中间状态辅助记录
    this.resultTextTemp = "";
    transWorker.onmessage = function (event) {
      self.audioData.push(...event.data);
    };
  }

  // 修改录音听写状态 init ing end
  setStatus(status) {
    this.onWillStatusChange &&
      this.status !== status &&
      this.onWillStatusChange(this.status, status);
    this.status = status;
  }

  // 连接websocket
  connectWebSocket() {
    return getWebSocketUrl().then((url) => {
      let iatWS;
      if ("WebSocket" in window) {
        iatWS = new WebSocket(url);
      } else if ("MozWebSocket" in window) {
        // eslint-disable-next-line no-undef
        iatWS = new MozWebSocket(url);
      } else {
        console.log("浏览器不支持WebSocket");
        return;
      }
      this.webSocket = iatWS;
      // 建立连接，初始状态
      this.setStatus("init");
      // 监听是否开启
      iatWS.onopen = () => {
        this.setStatus("ing");
        this.mediaSource.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.audioContext.destination);
        // 重新开始录音
        setTimeout(() => {
          this.webSocketSend();
        }, 500);
      };
      // 接收返回信息
      iatWS.onmessage = (e) => {
        this.dealResult(e.data);
      };
      iatWS.onerror = () => {
        this.recorderStop();
      };
      iatWS.onclose = () => {
        this.recorderStop();
        endTime = Date.parse(new Date());
        console.log("持续时长:", endTime - startTime, "ms");
        this.onWSClose && this.onWSClose();
      };
    });
  }

  // 设置文字
  setResultText({ resultText, resultTextTemp } = {}) {
    this.onTextChange && this.onTextChange(resultTextTemp || resultText || "");
    resultText !== undefined && (this.resultText = resultText);
    resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp);
  }

  // 识别结束
  dealResult(resultData) {
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = "";
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }

      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === "apd") {
          // 将resultTextTemp同步给resultText
          this.setResultText({
            resultText: this.resultTextTemp,
          });
        }
        // 将结果存储在resultTextTemp中
        this.setResultText({
          resultTextTemp: this.resultText + str,
        });
      } else {
        this.setResultText({
          resultText: this.resultText + str,
        });
      }
    }
    // 2: 最后一帧音频
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.webSocket.close();
      // jsonData.message = success
      // console.log("code=0, status=2:", jsonData.message);
    }
    if (jsonData.code !== 0) {
      this.webSocket.close();
      console.log(
        `code=${jsonData.code}, status=${jsonData.data.status}: ${jsonData.message}`
      );
    }
  }

  // 初始化浏览器录音
  recorderInit() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    // 创建音频环境
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.audioContext.resume();
      if (!this.audioContext) {
        console.log("浏览器不支持webAudioApi相关接口");
        return;
      }
    } catch (e) {
      if (!this.audioContext) {
        console.log("浏览器不支持webAudioApi相关接口");
        return;
      }
    }

    // 获取浏览器录音权限
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream) => {
          getMediaSuccess(stream);
        })
        .catch((e) => {
          getMediaFail(e);
        });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
        (stream) => {
          getMediaSuccess(stream);
        },
        function (e) {
          getMediaFail(e);
        }
      );
    } else {
      if (
        navigator.userAgent.toLowerCase().match(/chrome/) &&
        location.origin.indexOf("https://") < 0
      ) {
        console.log(
          "chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限"
        );
      } else {
        console.log("无法获取浏览器录音功能，请升级浏览器或使用chrome");
      }
      this.audioContext && this.audioContext.close();
      return;
    }

    // 获取浏览器录音权限成功的回调
    const getMediaSuccess = (stream) => {
      // 创建一个用于通过JavaScript直接处理音频
      // (0, 1, 1)
      // (4096,2,2)
      this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1);

      this.scriptProcessor.onaudioprocess = (e) => {
        // 去处理音频数据
        if (this.status === "ing") {
          transWorker.postMessage(e.inputBuffer.getChannelData(0));
        }
      };
      // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
      this.mediaSource = this.audioContext.createMediaStreamSource(stream);
      // 连接
      this.mediaSource.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);
      this.connectWebSocket();
    };

    const getMediaFail = () => {
      console.log("请求麦克风失败");
      this.audioContext && this.audioContext.close();
      this.audioContext = undefined;
      // 关闭websocket
      if (this.webSocket && this.webSocket.readyState === 1) {
        this.webSocket.close();
      }
    };
  }

  // 对处理后的音频数据进行base64编码，
  toBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // 向webSocket发送数据
  webSocketSend() {
    if (this.webSocket.readyState !== 1) {
      return;
    }
    let audioData = this.audioData.splice(0, 1280);
    // https://www.xfyun.cn/doc/asr/voicedictation/API.html#%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8%E6%B5%81%E7%A8%8B
    let params = {
      common: {
        app_id: this.appId,
      },
      business: {
        language: this.language, //zh_cn：中文（支持简单的英文识别），小语种可在控制台--语音听写（流式）--方言/语种处添加试用
        domain: "iat", // iat：日常用语
        accent: this.accent, //mandarin：中文普通话、其他语种，中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
        vad_eos: 3000, // 用于设置端点检测的静默时间，单位是毫秒。即静默多长时间后引擎认为音频结束。默认2000
        dwa: "wpgs", //wpgs：开启流式结果返回功能，为使该功能生效，需到控制台开通动态修正功能（该功能免费）
      },
      data: {
        status: 0, // 音频的状态 0 :第一帧音频 1 :中间的音频 2 :最后一帧音频，最后一帧必须要发送
        format: "audio/L16;rate=16000", // 音频的采样率支持16k和8k 16k音频：audio/L16;rate=16000
        encoding: "raw", // 音频数据格式 raw：原生音频（支持单声道的pcm）
        audio: this.toBase64(audioData), // 音频内容，采用base64编码
      },
    };

    this.webSocket.send(JSON.stringify(params));

    startTime = Date.parse(new Date());

    this.handlerInterval = setInterval(() => {
      // websocket未连接
      if (this.webSocket.readyState !== 1) {
        this.audioData = [];
        clearInterval(this.handlerInterval);
        return;
      }
      if (this.audioData.length === 0) {
        if (this.status === "end") {
          // 数据上传完毕，客户端需要上传一次数据结束标识表示会话已结束
          this.webSocket.send(
            JSON.stringify({
              data: {
                status: 2, // 数据上传结束标识
                format: "audio/L16;rate=16000",
                encoding: "raw",
                audio: "",
              },
            })
          );
          this.audioData = [];
          clearInterval(this.handlerInterval);
        }
        return false;
      }
      // 建议：未压缩的PCM格式，每次发送音频间隔40ms，每次发送音频字节数1280B；
      // 发送数据时，如果间隔时间太短，可能会导致引擎识别有误。
      audioData = this.audioData.splice(0, 1280);
      // 中间帧
      this.webSocket.send(
        JSON.stringify({
          data: {
            status: 1,
            format: "audio/L16;rate=16000",
            encoding: "raw",
            audio: this.toBase64(audioData),
          },
        })
      );
    }, 40);
  }

  // 开始录音
  recorderStart() {
    if (!this.audioContext) {
      this.recorderInit();
    } else {
      this.audioContext.resume();
      this.connectWebSocket();
    }
  }

  // 暂停录音
  recorderStop() {
    // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
    if (
      !(
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      )
    ) {
      this.audioContext && this.audioContext.suspend();
    }
    this.setStatus("end");
  }

  // 开始，在外部代码中调用
  start() {
    // 清掉历史记录
    this.setResultText({ resultText: "", resultTextTemp: "" });
    this.recorderStart();
  }

  // 停止，在外部代码中调用
  stop() {
    this.recorderStop();
  }
}

export default IatRecorder;
