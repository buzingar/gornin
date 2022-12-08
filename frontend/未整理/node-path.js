// const path = require('path');
const fs = require('fs');

// basename: 基础路径, 有文件路径就不是基础路径，基础路劲是1.js
// extname: 获取扩展名
// dirname: 父级路劲
// join: 拼接路径
// resolve: 当前文件夹的绝对路径，注意使用的时候不要在结尾添加/
// __dirname: 当前文件所在文件夹的路径
// __filename: 当前文件的绝对路径

// console.log('basename:', path.basename('math.js'));
// console.log('extname:', path.extname('math.js'));
// console.log('dirname:', path.dirname('math.js'));
// console.log('join:', path.join(__dirname, 'math.js'));
// console.log('resolve:', path.resolve('math.js'));
// console.log('__dirname:', __dirname);
// console.log('__filename:', __filename);
const ext = ['.json', '.js'];
let index = 0;
function findFile(path) {
  try {
    console.log('index:', index);
    var et = ext[index++];
    var p = path + et;
    console.log('path:', p);
    fs.accessSync(p);
    return p;
  } catch (error) {
    findFile(path);
  }
}
var p = findFile('math');
console.log(p);
