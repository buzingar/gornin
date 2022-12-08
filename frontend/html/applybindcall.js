console.dir(Function); // 查看prototype

function a() {
  console.log(this, 'a');
}
function b() {
  console.log(this, 'b');
}
a.call.call.call(b, 'b');
// 一个函数call2次或者2次以上 执行的永远是b（b需要是一个函数）， 并且call的第二个参数成为当前context

Function.prototype.call = function (context, ...args) {
  context = context ? Object(context) : window;
  context.fn = this;
  var r = context.fn(...args);
  delete context.fn;
  return r;
};

function c(context) {
  context = context ? Object(context) : window;
}
