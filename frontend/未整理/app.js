var app = {
  name: 'app',
  version: '1.0.0',
  sayName: function (name) {
    console.log(this.name);
  },
};
// * module.exports返回的是模块对象本身，返回的是一个类
module.exports = app;
