/**
 * 判断类型
 *
 * @param {*} val
 * @returns
 */
function isType(val, type) {
  // "[object String]"
  const val = Object.prototype.toString
    .call(val)
    .replace(/\[object (.*)\]/, '$1');
  return val === type;
}

/**
 * 基本数据类型
 * 引用数据类型 数组、对象、函数、
 * undefined、null
 * 循环引用
 * Symbol
 * Buffer对象、Promise、Set、Map
 *
 * @param {*} objects
 */
function cloneDeep(objects) {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = (parent) => {
    // null 特殊
    if (parent === null) return null;
    // 基本数据类型用typeof就能区分
    if (typeof parent !== 'object') return parent;

    let child, proto;

    if (isType(parent, 'Array')) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, 'RegExp')) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i]);
    }

    return child;
  };

  return _clone(parent);
}

/**
 * 简单clone，很多情况未考虑到，如循环引用、Symbol、Buffer对象、Promise、Set、Map等
 *
 * @param {*} objects
 * @returns
 */
function cloneSimple(objects) {
  if (objects == null) {
    return null;
  }
  // 基本类型，返回原值
  if (typeof objects !== 'object' && typeof objects !== 'function') {
    return objects;
  }
  // 判断
  const no =
    Object.prototype.toString.call(objects) === '[object Array]' ? [] : {};

  for (i in objects) {
    if (objects.hasOwnProperty(i)) {
      const temp = objects[i];
      no[i] = typeof temp === 'object' ? cloneSimple(temp) : temp;
    }
  }
  return no;
}

/* -------------test------------- */
function person(pname) {
  this.name = pname;
}

const Messi = new person('Messi');

function say() {
  console.log('hi');
}

const oldObj = {
  a: say,
  c: new RegExp('ab+c', 'i'),
  d: Messi,
};

oldObj.b = oldObj;

const newObj = cloneDeep(oldObj);
console.log(newObj.a, oldObj.a); // [Function: say] [Function: say]
console.log(newObj.b, oldObj.b); // { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] } { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] }
console.log(newObj.c, oldObj.c); // /ab+c/i /ab+c/i
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: person] [Function: person]
