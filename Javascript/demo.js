function _new() {
  // 空对象
  let target = {};
  // 第一个参数是构造函数
  let [constructor, ...args] = [...arguments];
  // shift()用于把数组的第一个元素从其中删除,并返回第一个元素的值,取出参数列表的第一个参数（构造函数）
  // 也可以 let constructor = [].shift.call(arguments);
  console.log('ctor:', constructor);
  // [[proto]]连接,手动指正target的构造函数为constructor（链接原型）
  target.__proto__ = constructor.prototype;
  // 执行构造函数，将属性和方法添加到创建的空对象上
  // 调用constructor，改变this为target，传入剩余参数arguments
  // 此时构造函数中的this为target，即target.name = name; target.age = age;
  let result = constructor.apply(target, args);
  console.log('result:', result);
  // 如果构造函数执行的结构返回的是一个对象，则返回此对象
  if (result && (typeof result == 'object' || typeof result == 'function')) {
    return result;
  }
  // 如果构造函数返回的不是一个对象，返回创建的新对象
  return target;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

function create(Con, ...args) {
  console.log('constructor:', Con);
  // 新建空对象
  const obj = {};
  // 将新对象的__proto__与构造函数Con的prototype关联起来
  Object.setPrototypeOf(obj, Con.prototype); // 即 obj.__proto__ = Con.prototype
  // 使用obj调用Con函数，入参为args
  const result = Con.apply(obj, args); // function obj(args){Con(args);}
  console.log('result:', result);
  // 构造函数如果返回一个对象，返回result，否则返回空对象obj
  return result instanceof Object ? result : obj;
}

const personBySelfNew = _new(Person, 'gornin', 18);
const personByCreate = create(Person, 'gornin', 18);
const personByNew = new Person('gornin', 18);

console.log(personBySelfNew);
console.log(personByCreate);
console.log(personByNew);

const obj = { name: 'gornin', age: 18 };

console.log(Person.prototype.constructor === Person); // true
console.log(obj instanceof Person); // false
console.log(personBySelfNew instanceof Person); // true
console.log(personByCreate instanceof Person); // true
console.log(personByNew instanceof Person); // true
