console.log('start');
// 异步事件，1s后执行 参数为函数的回调
setTimeout(function () {
  console.log('execute after 1000ms');
}, 1000);
setTimeout(function () {
  console.log('execute2 after 1000ms');
}, 999);
console.log('end');
