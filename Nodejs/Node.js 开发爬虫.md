爬虫，批量获取想要的数据，方便快捷省心省力，前端人，Node.js能搞，就先不去趟python那水啦。

---

## 可能要用到的三方库

- [superagent](https://www.npmjs.com/package/superagent)
- [got](https://www.npmjs.com/package/got)
- [axios]()
- [cheerio](https://www.npmjs.com/package/cheerio)
- [async](https://www.npmjs.com/package/async)
- [request](https://www.npmjs.com/package/request)
- [iconv-lite](https://www.npmjs.com/package/iconv-lite)
- [download](https://www.npmjs.com/package/download)
- [mysql](https://www.npmjs.com/package/mysql)



## 步骤

### 1. 确定爬取的目标

分析目标网页的html，定位特定字段，寻找标识符



### 2. 发送请求

拿到返回值，body或者json数据



### 3. 使用cheerio解析提取

类jQuery形式，`let $ = cheerio.load()`



### 4. 处理可能的乱码 iconv-lite

```javascript
homeBody = iconv.decode(homeBody,"GBK"); //进行gbk解码
```



### 5. 处理数据(写文件，存数据库，下载等)

```javascript
async getAndSaveImg(page) {
  let pageImgSetUrl = ``;

  // this.siteUrl 注意替换
  if (page === 1) {
    pageImgSetUrl = `${this.siteUrl}`;
  } else {
    pageImgSetUrl = `${this.siteUrl}${page}.html`;
  }

  let homeBody = await handleRequestByPromise({ url: pageImgSetUrl });
  let $ = cheerio.load(homeBody);
  let lis = $(".hezi li");

  for (let i = 0; i < lis.length; i++) {
    let config = {
      href: lis
      .eq(i)
      .find("a")
      .eq(0)
      .attr("href"),
      num: lis
      .eq(i)
      .find(".shuliang")
      .text(),
      title: lis
      .eq(i)
      .find(".biaoti a")
      .text()
      .replace(/\//, "")
    };

    config.childs = [];

    let num = Number(config.num.substr(0, 2));
    for (let j = 1; j <= num; j++) {
      let link = config.href.replace(
        this.collectUrl,
        "https://ii.hywly.com/a/1/"
      );
      let a_link = `${link}${j}.jpg`;
      config.childs.push(a_link);
    }
    this.all.push(config);
  }
}
```

下载图片

```javascript
async downloadAllImg() {
  let length = this.all.length;

  for (let index = 0; index < length; index++) {
    let childs = this.all[index].childs;
    let title = this.all[index].title;

    if (childs) {
      let c_length = childs.length;
      for (let c = 0; c < c_length; c++) {
        if (!fs.existsSync(`mrw`)) {
          fs.mkdirSync(`mrw`);
        }

        if (!fs.existsSync(`mrw/${title}`)) {
          fs.mkdirSync(`mrw/${title}`);
        }

        await super.downloadImg(
          childs[c],
          `mrw/${title}/${title}_image${c}.jpg`
        );

        console.log(
          "DownloadThumbsImg:",
          title,
          "SavePath:",
          `mrw/${title}/${title} image${c}.jpg`
        );
      }
    }
  }
}
```

存入mysql

```javascript
const fs = require("fs");
const mysql = require("mysql");
const path_dir = "D:\\data\\wwwroot\\xiezhenji.web\\static\\mrw\\";
const connection = mysql.createConnection({
  host: "xxxx",
  port: "xxxx",
  user: "xiezhenji",
  password: "iJAuzTbdrDJDswjPN6!*M*6%Ne",
  database: "xiezhenji"
});

module.exports = {
  insertImg
};

function insertImg() {
  connection.connect();

  let files = fs.readdirSync(path_dir, {
    encoding: "utf-8"
  });

  files.forEach((file, index) => {
    let cover_img_path = `/mrw/mrw_${index + 1}/image_1`;

    insert([
      "美女",
      file,
      Number(files.length),
      file,
      cover_img_path,
      `mrw/mrw_${index + 1}`,
      `mrw_${index + 1}`
    ]);
  });
}

function insert(arr) {
  let sql = `INSERT INTO photo_album_collect(tags,name,num,intro,cover_img,dir,new_name) VALUES(?,?,?,?,?,?,?)`;
  let sql_params = arr;

  connection.query(sql, sql_params, function(err, result) {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    console.log("--------------------------SELECT----------------------------");
    console.log(result);
    console.log(
      "------------------------------------------------------------\n\n"
    );
  });
}
```

utils/ajax.js

```javascript
let request = require("request");

module.exports = {
  handleRequestByPromise
};

function handleRequestByPromise(options) {
  let op = Object.assign(
    {},
    {
      url: "",
      method: "GET",
      encoding: null,
      header: {
        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        Referer: "https://www.meituri.com"
      }
    },
    options
  );

  if (op.url === "") {
    throw new Error("请求的url地址不正确");
  }

  const promise = new Promise(function(resolve, reject) {
    request(op, (err, response, body) => {
      if (err) reject(err);

      if (response && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(`请求✿✿✿${url}✿✿✿失败`);
      }
    });
  });

  return promise;
}
```





