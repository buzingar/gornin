# docsify

## install

npm i docsify-cli -g

> [docsify-cli 文档](https://github.com/docsifyjs/docsify-cli)

## init

docsify init ./docs

> docs 目录名称，自己定

## 结构

- `index.html` 入口文件
- `README.md` 主页
- `.nojekyll` 用于阻止 GitHub Pages 忽略掉下划线开头的文件

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

如果你想要浏览到一个目录时，只显示这个目录自己的侧边栏，这可以通过在每个文件夹中添加一个 \_sidebar.md 文件来实现。

\_sidebar.md 的加载逻辑是从每层目录下获取文件，如果当前目录不存在该文件则回退到上一级目录。

## 标题

在文件名后面指定页面标题

```markdown
<!-- _sidebar.md -->

[Guide](guide.md "指引")
```

## 开启目录

自定义侧边栏后默认不会再生成目录，设置 subMaxLevel 配置项，可以在自定义侧边栏时开启目录功能。

```js
subMaxLevel:2, // 设置生成目录的最大层级
```

## 封面

```js
window.$docsify = {
  coverpage: true,
};
```

创建`_coverpage.md`文件

### 自定义背景 <!-- {docsify-ignore} -->

```markdown
<!-- 背景图片 -->

![](_media/bg.png)

<!-- 背景色 -->

![color](#f0f0f0)
```

## 忽略标题

```markdown
该标题不会出现在侧边栏的目录中。

## Header <!-- {docsify-ignore} -->

要忽略特定页面上的所有标题，你可以在页面的第一个标题上使用 <!-- {docsify-ignore-all} -->
```

## 资源

> 中文文档：https://docsify.js.org/#/zh-cn/
>
> 参考布局：https://github.com/docsifyjs/docs-zh
>
> 资源：https://github.com/docsifyjs/awesome-docsify
