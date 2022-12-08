function Person(age) {
  this.name = ['A', 'B', 'C'];
  this.age = age;
}

Person.prototype.run = function () {
  return this.name + ' - ' + this.age;
};

new Person(18).run(); // "A,B,C - 18"
/* -------------------------------------------------------------- */
// 原型链继承
function Child() {}

// 子类实例的原型等于父类的实例
/* new Child().__proto__ = */ Child.prototype = new Person();

var child = new Child(18);
var child1 = new Child(20);

console.log(child.run(), child1.run()); // A,B,C - undefined A,B,C - undefined
console.log(child.age, child1.age); // undefined undefined
console.log(child.name, child1.name); // ["A", "B", "C"] ["A", "B", "C"]
child.name.push('D');
console.log(child.name, child1.name); // ["A", "B", "C", "D"] ["A", "B", "C", "D"]
/**
 * ! 问题
 * ! 1. 不能传参，age未接收到
 * ! 2. 一个实例改变引用属性，影响其他实例
 */
/* -------------------------------------------------------------- */
// 借用构造函数继承
// 对象冒充，借用构造函数，可以传参
function Child(age) {
  // 对象冒充，给超类型传参
  Person.call(this, age);
}

var child = new Child(18);
var child1 = new Child(20);

console.log(child.age, child1.age); // 18 20
console.log(child.name, child1.name); // ["A", "B", "C"] ["A", "B", "C"]
child.name.push('D');
console.log(child.name, child1.name); // ["A", "B", "C", "D"] ["A", "B", "C"]
console.log(child.run(), child1.run()); // Uncaught TypeError: *.run is not a function
/**
 * * 解决了什么问题
 * * 1. 给超类传参
 * * 2. 引用属性共享
 * ! 引入了什么问题
 * ! 1. 没有原型，无法进行复用
 */
/* -------------------------------------------------------------- */
// 组合继承
// 原型链继承+构造函数继承
function Child(age) {
  //对象冒充
  Person.call(this, age);
}

// 原型链继承
Child.prototype = new Person();
var child = new Child(18);
var child1 = new Child(20);

console.log(child.age, child1.age); // 18 20
console.log(child.name, child1.name); // ["A", "B", "C"] ["A", "B", "C"]
child.name.push('D');
console.log(child.name, child1.name); // ["A", "B", "C", "D"] ["A", "B", "C"]
console.log(child.run(), child1.run()); // "A,B,C,D - 18" "A,B,C - 20"
/**
 * * 解决了什么问题
 * * 1. 不存在引入属性共享的问题
 * * 2. 能给超类传参
 * * 3. 拥有原型链，可以复用原型链属性和方法
 * ! 引入了什么问题
 * ! 1. 有两次调用的情况，对于Person的调用，子类call一次，原型链继承new一次
 */
/* -------------------------------------------------------------- */
// 原型式继承
// object.create()
function createObj(obj) {
  function F() {} // 创建一个构造函数
  F.prototype = obj; // 把实例对象赋值给构造函数的原型
  return new F(); // 返回实例化对象
}

// 基础对象
// var child = {
//   name: ['A', 'B', 'C'],
//   age: 18,
// };

var child = new Person(18); // Person {name:['A','B','C'], age:18}
var child1 = createObj(child); // F {}
var child2 = createObj(child);
var child3 = createObj(child);

console.log(child.name, child1.name); // ["A", "B", "C"] ["A", "B", "C"]
console.log(child.age, child1.age); // 18 18
child.name.push('D');
child1.age = 20;
child2.name = ['E'];
child3.addr = 'China';
console.log(child.name, child1.name, child2.name); // ["A", "B", "C", "D"] ["A", "B", "C", "D"] ["E"]
console.log(child.age, child1.age, child2.age); // 18 20 18
console.log(child.addr, child1.addr, child2.addr);

/**
 * * 优点
 * * 1. 类似于复制一个对象，用函数来包装
 * ! 不足
 * ! 所有实例都会继承原型上的属性
 * ! 无法实现复用，为新实例添加属性，其他实例不能使用
 */
/* -------------------------------------------------------------- */
// 寄生式继承

// 基础对象
var child = {
  name: ['A', 'B', 'C'],
  age: 18,
};

function createObj(obj) {
  function F() {} // 创建一个构造函数
  F.prototype = obj; // 把实例对象赋值给构造函数的原型
  return new F(); // 返回实例化对象
}

// 在原型继承基础上，用函数包裹住创建新实例的方法，为新实例添加属性和方法，并返回新实例
function createChild(obj) {
  var newobj = createObj(obj); // 创建对象 或者用 var newob = Object.create(ob)
  newobj.sayName = function () {
    // 增强对象
    console.log(this.name);
  };
  return newobj; // 指定对象
}

createChild(child);
// ! 主要用来与寄生组合式继承做对比
/* -------------------------------------------------------------- */
// 寄生组合式继承
function Child(age) {
  Person.call(this, age);
}

// ! ---------------------------------------------- ! //
function createObj(obj) {
  function F() {}
  F.prototype = obj; // Parent.prototype
  return new F();
}

function prototype(Child, Parent) {
  var prototype = createObj(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}

prototype(Child, Person);
// ! ---------------------------------------------- ! //

// ! 替换为上面俩函数调用 ! //
// Child.prototype = new Person();

var child = new Child(18);
var child1 = new Child(20);

console.log(child.age, child1.age); // 18 20
console.log(child.name, child1.name); // ["A", "B", "C"] ["A", "B", "C"]
child.name.push('D');
console.log(child.name, child1.name); // ["A", "B", "C", "D"] ["A", "B", "C"]
console.log(child.run(), child1.run()); // "A,B,C,D - 18" "A,B,C - 20"
/**
 * * 解决了什么问题
 * * 1. 不存在引入属性共享的问题
 * * 2. 能给超类传参
 * * 3. 拥有原型链，可以复用原型链属性和方法
 * * 4. 不存在两次调用超类型的情况
 * ! 引入了什么问题
 * ! 1. 复杂性
 */
