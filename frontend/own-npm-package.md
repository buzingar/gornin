# 发布自己的 npm 包

## 发布 scope 库 如 @a/b

### 注册 npm 账号

登录时会往注册邮箱发送 OTP code （one-time password），8 位数字

#### Add a Organization

创建一个组织，即@后的名称

### 初始化目录

```bash
$ mkdir b
$ cd b
$ npm init --scope=a
```

修改 package.json

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

```bash
$ npm publish --access=public
```
