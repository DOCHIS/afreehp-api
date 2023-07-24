const proxy = require("express-http-proxy");

/**
 * 기본 프록시
 */
module.exports = proxy("http://afreehp.kr");

/**
 * 아프리카 도우미 프록시
 */
module.exports.afreecahelper = proxy("http://afreecahelper.m.afreecatv.com");

/**
 * 오디오 파일 프록시
 */
module.exports.saveDefaultAudio = proxy("https://file.afreehp.kr", {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.headers["referer"] = "http://afreehp.kr/";
    return proxyReqOpts;
  },
  proxyReqPathResolver: function (req) {
    const url = req.url.replace(
      "/resource/save/default/audio/",
      "/default/audio/"
    );
    return url;
  },
});

/**
 * 스크립트 파일 프록시
 */
module.exports.dev = proxy("http://afreehp.kr", {
  userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
    const url = userReq.url;
    const data = proxyResData.toString("utf8");

    // url이 '/resource/dev/js/connect.js' 로 시작하는 경우
    if (url.indexOf("/resource/dev/js/connect.js") === 0) {
      return data.replace(
        "cmd: function(type, data) {",
        "cmd: function(type, data) { collectCmd(type, data);"
      );
    }

    return data;
  },
});

/**
 * 얼럿박스 페이지 프록시
 */
module.exports.page = proxy("http://afreehp.kr", {
  userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
    const timestamp = new Date().getTime();
    const data = proxyResData
      .toString("utf8")
      .replace(/http:\\\/\\\/afreecahelper.m.afreecatv.com/g, "")
      .replace(/http:\/\/afreecahelper.m.afreecatv.com/g, "")
      .replace("https://file.afreehp.kr", "")
      .replace("</head>", "<script>var WS_URL = '" + process.env.SOCKET_URL + "';</script><script src='/app/page.js?v=2'></script></head>")
      .replace(/ver: "(\d+)"/g, function (match, p1) {
        return "ver: '" + timestamp + "_" + p1 + "'";
      })
      .replace(/urlArgs:"ver=(\d+)"/g, function (match, p1) {
        return "urlArgs:'ver=" + timestamp + "_" + p1 + "'";
      });
    return data;
  },
});

/**
 * API 프록시
 */
module.exports.api = proxy("http://afreehp.kr", {
  userResDecorator: async function (proxyRes, proxyResData, userReq, userRes) {
    // 요청 host 변조
    userReq.headers["Origin"] = "http://afreehp.kr";
    userReq.headers["Referer"] = "http://afreehp.kr/page/Upxxxxxxx8bYmqSVwJY";
    return proxyResData;
  },
});
