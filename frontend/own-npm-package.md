# 发布自己的 npm 包

## 发布 scope 库 如 @a/b

### 注册 npm 账号

登录时会往注册邮箱发送 OTP code （one-time password），8 位数字

#### Add a Organization

创建一个组织，即@后的名称

### 初始化目录

```bash
# a 是空间名，b是包名，组合后就是 @a/b
$ mkdir b
$ cd b
$ npm init --scope=a
```

### 整理目录结构

创建 src 和 lib 目录

src 中编写代码，在 index.ts 中 export，与 rollup 中设置的 input 有关系

### 配置 eslint

yarn add eslint -D

npm init @eslint/config

根据个人实践，建议选 json 或 yaml，选择 js，其引入方式为 require，很有可能会报错。我在 package.json 中添加了 `"type": "module",`

自动生成如下配置：

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "standard-with-typescript",
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {}
}
```

[eslint rules](http://eslint.cn/docs/rules/)

### 配置 prettier

prettier 与 eslint 规则有差异，二者修改其一规则

https://blog.csdn.net/zy21131437/article/details/123575157

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false
}
```

### 配置 babel

npm install --save-dev @babel/cli @babel/core @babel/preset-env

创建 `.babelrc` 文件

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

### 配置 typescript

npm i -D typescript tslib

tsc --init

自动生成 tsconfig.json 文件

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "ESNext",
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./lib",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 配置 rollup

https://www.rollupjs.com/

https://juejin.cn/post/6844904058394771470

yarn add -D @rollup/plugin-terser rollup-plugin-filesize rollup-plugin-serve rollup-plugin-livereload @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-typescript @rollup/plugin-commonjs @rollup/plugin-eslint @rollup/plugin-babel

rollup.config.base.js

```js
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import eslint from "@rollup/plugin-eslint";
import { babel } from "@rollup/plugin-babel";

import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// import pkg from "./package.json";

const formatName = "utils";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    {
      file: pkg.browser,
      format: "umd",
      name: formatName, // [!] RollupError: You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.
    },
  ],
  plugins: [
    json(),
    commonjs({
      include: /node_modules/,
    }),
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    typescript(),
    eslint(),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
  ],
};
```

rollup.config.dev.js

```js
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import baseConfig from "./rollup.config.base.js";

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      open: true,
      contentBase: "",
      port: 8000,
    }),
    livereload("src"),
  ],
};
```

rollup.config.js

```js
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";

import baseConfig from "./rollup.config.base.js";

export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, terser(), filesize()],
};
```

### 修改 package.json

```json
"type": "module", // 在nodejs中使用es6模块语法
"main": "lib/bundle.cjs.js",
"jsnext:main": "lib/bundle.esm.js",
"module": "lib/bundle.esm.js",
"browser": "lib/bundle.browser.js",
"types": "types/index.d.ts", // 声明类型文件，代码提示
"scripts": {
  "dev": "rollup -wc rollup.config.dev.js",
  "build:types": "npx tsc",
  "build": "rollup -c rollup.config.js && npm run build:types"
},
"devDependencies": {
  "@babel/cli": "^7.19.3",
  "@babel/core": "^7.20.5",
  "@babel/preset-env": "^7.20.2",
  "@rollup/plugin-babel": "^6.0.3",
  "@rollup/plugin-commonjs": "^23.0.3",
  "@rollup/plugin-eslint": "^9.0.1",
  "@rollup/plugin-json": "^5.0.2",
  "@rollup/plugin-node-resolve": "^15.0.1",
  "@rollup/plugin-terser": "^0.1.0",
  "@rollup/plugin-typescript": "^10.0.1",
  "@typescript-eslint/eslint-plugin": "^5.0.0",
  "eslint": "^8.0.1",
  "eslint-config-standard-with-typescript": "^23.0.0",
  "eslint-plugin-import": "^2.25.2",
  "eslint-plugin-n": "^15.0.0",
  "eslint-plugin-promise": "^6.0.0",
  "rollup": "^3.5.1",
  "rollup-plugin-filesize": "^9.1.2",
  "rollup-plugin-livereload": "^2.0.5",
  "rollup-plugin-serve": "^2.0.2",
  "tslib": "^2.4.1",
  "typescript": "^4.9.3"
}
```

### test 测试

将函数添加到 index.js 后 ，我们现在可以为库生成分发代码了。 这是通过使用下面的命令使用 Babel 完成的。

`npx babel lib --out-dir dist`

这将在根目录中创建一个名为“dist”的新目录，其中包含已编译的 JavaScript。

cd dist && npm link

在测试工程中执行 npm link @a/b

在代码中引用

#### jest ts-jest

我们使用 ts-jest 来对代码进行测试：yarn add jest ts-jest @types/jest -D

创建 jest 配置文件: npx ts-jest config:init

```js
// 使用es语法，不要使用module.exports={}
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.ts$": "ts-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      useESM: true,
      // tsconfig: 'tsconfig.test.json'
    },
  },
};
```

在 package.json 中新增测试 scripts: test

```json
"scripts":{
  "test": 'jest'
}
```

### npm registry 为官方源，不是是国内的镜像

建议使用 nrm 管理

```bash
$ npm i nrm
$ nrm ls
$ nrm use npm
```

### 添加用户

`npm adduser`

- Username: xxx
- Password: xxx
- Email: a@a
- OTP: xxxxxxxx

### 发布

新建 `.npmignore` 文件，排除 node_modules，可以减小 Unpacked Size

```json
node_modules/
```

发布前，确认下是不是之前登录过的源，否则会提示你登录 adduser && login

```bash
$ npm publish --access=public
```

### 其他 npm 命令

- npm login
- npm logout
- npm who am i
- npm unpublish [pkg]@[version]

## 版本号

### semver 语义化版本规范

`major.minor.patch-pre`

- 主版本号(major)：当你做了不兼容的 API 修改
- 次版本号(minor)：当你做了向下兼容的功能性新增
- 修订号(patch)：当你做了向下兼容的问题修正
- 先行版本号(pre)
  - alpha：不稳定版本，一般而言，该版本的 Bug 较多，需要继续修改，是测试版本
  - beta：基本稳定，相对于 Alpha 版已经有了很大的进步，消除了严重错误
  - rc：和正式版基本相同，基本上不存在导致错误的 Bug
  - release：最终版本

### ^ ~ >=

- `^` 锁定主版本号，即 major 不变
- `~` 锁定主次版本号，即 major.minor 不变
- `>=` 符合范围的版本号皆可

### 半自动操作版本命令

> 执行一下命令，会将相应版本+1

- `npm version patch`
- `npm version minor`
- `npm version major`
- `npm version prepatch`
- `npm version preminor`
- `npm version premajor`
- `npm version prerelease`

## 许可证

- 修改源码后是否可以闭源？
  - y：是否需要版权？
    - y：Apache 许可
    - n：商用后能否用作者名字宣传？
      - y：MIT 许可
      - n：ISC 许可/BSD 许可
  - n：新增代码是否采用同样许可？
    - y：GPL 许可
    - n：是否需要对修改处提供说明文档？
      - y：Mozilla 许可
      - n：LGPL 许可

## Problems

---

解决 元素隐式具有 “any“ 类型，因为类型为 “string“ 的表达式不能用于索引类型 “Object“。 在类型 “Object“ 上找不到具有类型为 “string“ 的参数的索引签名

https://blog.csdn.net/zy21131437/article/details/121246493

---

1. `(!) Plugin typescript: @rollup/plugin-typescript: Rollup requires that TypeScript produces ES Modules. Unfortunately your configuration specifies a "module" other than "esnext". Unless you know what you're doing, please change "module" to "esnext" in the target tsconfig.json file or plugin options.`

解问题：修改 tsconfig.json 中`"module": "ESNext"`

### import or require

在 node.js 环境使用 import 语法

`'type': 'module'` in package.json

https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error

【ERR_UNKNOWN_FILE_EXTENSION】Node-ES6 的 import 无法导入 json 文件的解决办法【--experimental-json-modules】

// --experimental-json-modules 参数可以解决 import 导入 json 的问题
node --experimental-json-modules index.js

### eslint

"No ESLint configuration found" error

https://stackoverflow.com/questions/38173326/no-eslint-configuration-found-error

./node_modules/.bin/eslint --init

### parserOptions.project

[!] (plugin eslint) Error: Error while loading rule '@typescript-eslint/dot-notation': You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.
Occurred while linting /Users/gornin/my_npm_packages/utils/src/index.ts

```json
parserOptions:{
  "project": "./tsconfig.json"
}
```

https://stackoverflow.com/questions/39282873/object-hasownproperty-yields-the-eslint-no-prototype-builtins-error-how-to

You can access it via Object.prototype:

`Object.prototype.hasOwnProperty.call(obj, prop);`

That should be safer, because

Not all objects inherit from Object.prototype
Even for objects which inherit from Object.prototype, the hasOwnProperty method could be shadowed by something else.
Of course, the code above assumes that

The global Object has not been shadowed or redefined
The native Object.prototype.hasOwnProperty has not been redefined
No call own property has been added to Object.prototype.hasOwnProperty
The native Function.prototype.call has not been redefined
If any of these does not hold, attempting to code in a safer way, you could have broken your code!

Another approach which does not need call would be

`!!Object.getOwnPropertyDescriptor(obj, prop);`

hasOwnProperty checks if a string or symbol is an own property. key in entries checks if it's an own or inherited one.
