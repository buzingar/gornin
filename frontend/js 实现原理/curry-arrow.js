const sumFn = (a) => (b) => (c) => a + b + c;
// console.log('sum:', sumFn(1)(2)(5));

var arr = [1, 2, 3, 5, 6, 78, 9, 20];
var res = arr.reduce((total, cur) => total + cur);
// 0,1 => 0 + 1
// 1,2 => 1 + 2
// 3,3 => 3 + 3
// 6,5 => 6 + 5
// 11,6 => 11 + 6
// 17,78 => 17 + 78
// 95,9 => 95 + 9
// 104,20 => 104 + 20
// 124
// console.log('res:', res);

Array.prototype.ireduce = function (fn, baseNumber) {
  // 不能用箭头函数，否则没有this
  if (Object.prototype.toString.call(this) !== '[object Array]') {
    throw new TypeError('not an array');
  }
  if (typeof fn !== 'function') {
    throw new Error(`${fn} is not a function`);
  }
  if (!this.length) {
    throw new Error('reduce an empty array with no initial value');
  }

  // total
  let total = baseNumber || 0;
  // index
  let index = 0;
  while (index < this.length) {
    total = fn(total, this[index++], index, this);
  }
  return total;
};
var arr = [1, 2, 3, 5, 6, 78, 9, 20];
arr.ireduce((total, cur, index, arr) => total + cur);
