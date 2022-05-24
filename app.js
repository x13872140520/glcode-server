const express = require("express");
const path = require("path");
const fs = require("fs");
const { response } = require("express");
const stageTagsListCn = require('./backdrops-tags-cn.json')
const stageTagsListTw = require('./backdrops-tags-tw.json')
const stageTagsListEn = require('./backdrops-tags-en.json')
const stageList = require('./backdrops.json')
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
var lanMap=[]
lanMap['en']=stageTagsListEn
lanMap['zh-cn']=stageTagsListCn
lanMap['zh-tw']=stageTagsListTw
app.get("/getStageTags", function (req, res) {
  res.send(lanMap[req.query.language]);
});
app.get("/getStageList", function (req, res) {
  res.send(stageList);
});
const port = 8603;
//127.0.0.1会导致无法访问
app.listen(port,'0.0.0.0', function () {
  console.log("sever05231346 listen to : " + port);
});