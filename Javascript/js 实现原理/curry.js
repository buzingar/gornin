function curry(fun) {
  let args = [];
  let count = fun.length; // 拿到调用函数需要的参数长度

  return function collect() {
    let len = arguments.length;
    console.log('len:', len);
    count -= len;
    console.log('count:', count);
    args = args.concat(Array.prototype.slice.call(arguments));
    console.log('args:', args);
    return count === 0 ? fun.apply(null, args) : collect;
  };
}

const add = curry(function (a, b, c) {
  return a + b + c;
});

const result = add(1)(2)(3);
console.log(result);
