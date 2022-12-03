# MAC 手势

## 禁用 MAC 版 Chrome 浏览器前进、后退手势的方法

### 全局禁用

系统偏好设置 -> 触控板

### 单独禁用 Chrome 浏览器手势

在终端里输入命令

`defaults write com.google.Chrome AppleEnableMouseSwipeNavigateWithScrolls -bool false`

`defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE`

[](https://zhuanlan.zhihu.com/p/481798545)
