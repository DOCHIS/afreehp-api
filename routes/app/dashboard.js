const awsDynamoDB = require("../../libraries/awsDynamodb");
const dynamodb = new awsDynamoDB();
let params = {
  head: {
    title: "아프리카 도우미",
    description: "",
    keywords: "",
  },
};

/**
 * 기본 프록시
 */
module.exports = async function (req, res) {
  const template = "dashboard/" + req.path.replace("/dashboard/", "");

  // 인증 처리
  if (template != "dashboard/start") {
    if (req.cookies?.login_session) {
      // UID 검증
      const alertboxUID = await dynamodb.getItem(
        `ALERTBOX`,
        `UID#${req.cookies.login_session}`
      );

      if (alertboxUID) {
        params.alertbox = alertboxUID;
      } else {
        res.clearCookie("login_session");
        return res.redirect("/dashboard/start?error=invalid_uid");
      }
    } else {
      return res.redirect("/dashboard/start?error=login_required");
    }
  }

  // 라우팅
  switch (template) {
    case "dashboard/start":
      return await startRoute(req, res);
    case "dashboard//dashboard":
      return await dashboardRoute(req, res);
    case "dashboard/logout":
      return await logoutRoute(req, res);
    case "dashboard/playground":
      return await playgroundRoute(req, res);
    default:
      return await notFoundRoute(req, res);
  }
};

/**
 * 시작하기 라우팅
 */
async function startRoute(req, res) {
  return res.render("dashboard/start", params);
}

/**
 * 대시보드 라우팅
 */
async function dashboardRoute(req, res) {
  params.data = {
    new_alertbox_url: `${process.env.APP_URL}/page/${params.alertbox.alertbox_idx}x8bYmqSVwJY`.replace("https:", "http:"),
  };
  return res.render("dashboard/index", params);
}

/**
 * logout 라우팅
 */
async function logoutRoute(req, res) {
  res.clearCookie("login_session");
  return res.redirect("/");
}

/**
 * playground 라우팅
 */
async function playgroundRoute(req, res) {
  return res.render("dashboard/playground", params);
}

/**
 * 404 라우팅
 */
async function notFoundRoute(req, res) {
  return res.status(404).send();
}
