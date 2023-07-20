const serverless = require("serverless-http");
const express = require("express");
const app = express();

// static 파일 라우팅 (실 서비스에서는 cloudfront를 통해 static 파일이 제공됨)
// 이 설정은 로컬환경을 위해 추가된 것임
app.use(express.static("public"));

// 루트 경로 라우팅
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// 아프리카 도우미에서 사용하는 라우팅
const afreehp = require("../routes/app/afreehp");
app.all("/save/*", afreehp);
app.all("/voice/*", afreehp);
app.get("/resource/js/*", afreehp);
app.get("/resource/css/*", afreehp);
app.get("/resource/img/*", afreehp);
app.get("/resource/audio/*", afreehp);
app.all("/api/broad/*", afreehp.afreecahelper);
app.get("/resource/save/default/audio/*", afreehp.saveDefaultAudio);
app.get("/resource/dev/*", afreehp.dev);
app.get("/page/*", afreehp.page);
app.all("/api/", afreehp.api);

// 핸들러
module.exports.handler = serverless(app);
