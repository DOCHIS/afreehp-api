const awsDynamoDB = require("../../libraries/awsDynamodb");

/**
 * 기본 프록시
 */
module.exports = async function (req, res) {
  const dynamodb = new awsDynamoDB();

  let route = req.path.replace("/dashboard/", "");
  let template = "dashboard/" + route;
  if (route == "/dashboard" || template == "dashboard/")
    template = "dashboard/index";

  // 로그아웃 요청인 경우
  if(template == "dashboard/logout") {
    res.clearCookie("login_session");
    return res.redirect("/");
  }

  // 쿠기가 있다면 쿠키 검증
  if (req.cookies?.login_session) {
    // UID 검증
    const alertboxUID = await dynamodb.getItem(
      `ALERTBOX`,
      `UID#${req.cookies.login_session}`
    );
    if (!alertboxUID) {
      res.clearCookie("login_session");
      return res.redirect("/dashboard/start");
    }
  } else {
    if (template != "dashboard/start") return res.redirect("/dashboard/start");
  }

  let params = {
    head: {
      title: "아프리카 도우미",
      description: "",
      keywords: "",
    },
  };

  return res.render(template, params);
};
