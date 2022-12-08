# cors

## 简单请求 

get post put

浏览器直接发送cors请求，在头信息中新增一个Origin字段，标识来源给服务器判断是否同意这次请求。

如果server不同意，正常http回应，头信息不包含`Access-Control-Allow-Origin` 字段，浏览器就会报错提示；

如果同意，就会在头信息添加几个字段，`Access-Control-Allow-*`

**Credentials** 表示是否允许发送Cookie，ajax请求也要配置 `xhr.withCredentials = true` ，否则浏览器依旧不会发送cookie。

如果要发送Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。

---

## 非简单请求

### 预检请求 preflight

非简单CORS请求，发生在正式通信之前，增加一次HTTP查询请求



目的：浏览器询问服务器，当前网页所在的域名是否在服务器的许可名单中，以及可以使用哪些http动词和头信息字段。肯定答复（response头包含cors字段），浏览器正式发出xhr，否则报错。



方式：preflight使用options请求方法，头信息带有 `Origin` 表示请求来自哪个源，还有 `Access-Control-Request-Method` 和 `Access-Control-Request-Headers` 

- 服务器同意

  回应头中包含三个 `Access-Control-Allow-*` 字段，表示同意跨源请求

- 服务器否定

  如果服务器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误



