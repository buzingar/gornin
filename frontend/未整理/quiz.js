/* ==============================
请写出如下代码的打印结果
*/
/* ----------code below---------- */
function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  this.a = function () {
    console.log(2);
  };
}
Foo.prototype.a = function () {
  console.log(3);
};
Foo.a = function () {
  console.log(4);
};
Foo.a(); // 4
let obj = new Foo(); // 有this.a 则obj.a是自身的，否则是原型链上的
console.log("gornin own:", obj.hasOwnProperty("a"));
obj.a(); // 2
Foo.a(); // 1
/* ------------------------------ */
// TODO comment?
/* ============================== */

/* ==============================
用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。
如：输入整型 1234，返回字符串“4321”。
要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。
*/
/* ----------code below---------- */
function revStr(num) {
  if (parseInt(num, 10) !== num) {
    throw new Error("请输入整数");
  }
  const numStr = `${num}`.split("");
  const len = numStr.length;
  const arr = new Array(numStr.length);

  numStr.forEach((n, i) => {
    arr[len - i - 1] = n;
  });
  return arr.join("");
}
const a = revStr(1234);
console.log("gornin num:", a);

/* ------------------------------ */
// TODO comment?
/* ============================== */
