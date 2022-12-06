# init a ts project

1. 创建目录

`mkdir ts-project && cd ts-project`

2. 初始化 npm

`npm init -y`

3. 安装依赖

`npm install --save-dev typescript tslint @types/node`

4. 生成 tsconfig.json

`./node_modules/.bin/tsc --init`

5. 配置 tslint.json

`./node_modules/.bin/tslint --init`

6. 创建 src/index.ts 文件

`console.log("hello TypeScript")`

7. 编译

`./node_modules/.bin/tsc`

8. 运行

`node ./dist/index.js`
