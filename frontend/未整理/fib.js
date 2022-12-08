/**
 * 斐波那契数，通常用 F(n) 表示，形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：
 * F(0) = 0，F(1) = 1
 * F(n) = F(n - 1) + F(n - 2)，其中 n > 1
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n === 1 || n === 0) {
    return n;
  }
  // 自顶向下递归
  // return fib(n - 1) + fib(n - 2);

  // 法二，递推，自底向上推
  let p = 0; // 前值
  let q = 1; // 后值
  let num = 1; // 计数，判断是否到到n

  while (num++ < n) {
    [p, q] = [q, p + q];

    if (num === n) {
      return q;
    }
  }
};

var res = fib(5);
console.log(res);
