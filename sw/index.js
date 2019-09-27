//创建HTTP服务器

//1. 加载http模块
const http = require("http");
const fs = require("fs");
const root = "./index.html";

//2. 创建http服务器
// 参数: 请求的回调, 当有人访问服务器的时候,就会自动调用回调函数
const server = http.createServer(function(req, res) {
  console.log("hello");
  let url = req.url; // 客户端输入的 url，例如如果输入 // http://localhost:3030/index.html
  if (url == "/") {
    url = "./index.html";
  }

  var file = url;
  console.log(url);
  fs.readFile(file, function(err, data) {
    if (err) {
      res.writeHeader(404, { "content-type": 'text/html;charset="utf-8"' });
      res.write("<h1>404 错误 </h1><p > 你要找的页面不存在 </p>");
      res.end();
    } else {
      res.writeHeader(200, { "content-type": 'text/html;charset="utf-8"' });
      res.write(data);
      res.end();
    }
  });

  //回调数据
});

//3. 绑定端口
server.listen(3030);

//4. 执行
console.log("执行了3030");
