Function.prototype.ibind = function (context) {
  // 调ibind的函数即this为test
  let calledFunc = this;
  let bindArgs = Array.prototype.slice.apply(arguments, [1]); // [].slice()

  // 中间函数，寄生式
  function Fn() {}

  function newFunc() {
    let args = Array.prototype.slice.apply(arguments, [0]);
    let totalArgs = bindArgs.concat(args);

    return calledFunc.apply(
      this instanceof newFunc ? this /* test */ : context,
      totalArgs
    );
  }

  // 继承原型上的属性和方法
  Fn.prototype = this.prototype;
  newFunc.prototype = new Fn();

  return newFunc;
};

const test = function (a, b) {
  console.log('作用域绑定 ' + this.value); // obj.value -> ok
  console.log('ibind参数传递 ' + a.value2); // ibind入参 -> also ok
  console.log('调用参数传递 ' + b); // 新函数调用入参 -> hello bind
};
const obj = {
  value: 'ok',
};
const newfunc = test.ibind(obj, { value2: 'also ok' }); // obj.test()

newfunc('hello bind');
