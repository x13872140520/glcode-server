const express = require("express");
const path = require("path");
const fs = require("fs");
const { response } = require("express");

const app = express();

app.get("*", function (req, res, next) {
  //设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");

  next();
});

app.get("/internalapi/asset/*/get/", function (req, res) {

  let url = req.url.replace("/get/", "");
  let suffix=url.substring(url.lastIndexOf('.'))
  if(suffix==='.png'){
    res.header("Content-Type",  'image/png');
  }else if(suffix==='.svg'){
    res.header("Content-Type",  'image/svg+xml');
  }
  console.log('suffix',suffix)
  file = path.join(process.cwd(), url);
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.end("no file " + url);
  }
});

const port = 8603;
app.listen(port,'127.0.0.1', function () {
  console.log("sever listen to : " + port);
});