使用 prettier 来格式化我们的代码建议在 git commit 时自动触发就好了，要给 git 设置钩子，我们可以使用 [husky](https://github.com/typicode/husky) 工具。

```bash
$ yarn add -D husky lint-staged prettier
```

[lint-staged](https://github.com/okonet/lint-staged) 是一个提高 lint 工具速度的工具，他的作用就和它的名字一样，lint-staged 可以让 lint 工具只 lint 保存在 stage 区的代码，从而加快 lint 速度。

接着配置 husky 和 lint-staged。在 package.json 中加入下面内容。

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --single-quote --write",
    "git add"
  ]
},
```
