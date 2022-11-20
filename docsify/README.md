# docsify

> https://docsify.js.org/#/zh-cn/

## install

npm i docsify-cli -g

> [docsify-cli 文档](https://github.com/docsifyjs/docsify-cli)

## init

docsify init ./docs

> docs 目录名称，自己定

## 结构

- `index.html` 入口文件
- `README.md` 主页
- `.nojekyll` prevents GitHub Pages from ignoring files that begin with an underscore

## 预览

> http://localhost:3000
>
> docs 换成自己创建的目录

`docsify serve docs`

## 指定版本 docsify versions

锁定版本
`<script src="//cdn.jsdelivr.net/npm/docsify@4.11.4"></script>`

主版本
`<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>`

## 更多 md 页面

创建一个名为 guide.md 的文件, 可以通过 /#/guide 访问

## sidebar

```html
<script>
  window.$docsify = {
    loadSidebar: true,
  };
</script>
```

创建 `_sidebar.md` 文件

```
<!-- docs/_sidebar.md -->

* [Home](/)
* [Guide](guide.md)
```

## 嵌套 sidebar
