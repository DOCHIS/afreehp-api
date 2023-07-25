const awsDynamoDB = require("../../../libraries/awsDynamodb");

/**
 * 시작하기 API
 * @access POST /service/api/start
 * @description dashboard에 접속하기 위해서 위젯 URL을 입력받아 검증하고 쿠키를 설정합니다.
 * @param {string} req.body.url 후원 위젯 URL
 *  @example http://afreehp.kr/page/xxxxxxx
 */
module.exports.start = async function (req, res) {
  const widgetUrl = req.body?.widgetUrl ? req.body.widgetUrl.trim() : "";

  // 위젯 URL 검증
  if (!widgetUrl)
    return res.json({ success: false, message: "위젯 URL을 입력해주세요." });

  // 위젯 URL 검증
  if (!widgetUrl.startsWith("http://afreehp.kr/page/"))
    return res.json({
      success: false,
      message: "위젯 URL이 아프리카 도우미 위젯 URL이 아닙니다. (URL은 http://afreehp.kr/page/로 시작합니다.)",
    });
  
  // x9jhl6aK1dLK1ZU 로 끝나는 URL은 허용하지 않음
  if (widgetUrl.endsWith("x9jhl6aK1dLK1ZU "))
    return res.json({
      success: false,
      message: "후원 위젯 URL이 아닙니다. (x9jhl6aK1dLK1ZU로 끝나는 주소는 후원 자막 URL입니다.)",
    });

  // 위젯 URL 검증
  if (!widgetUrl.endsWith("x8bYmqSVwJY"))
    return res.json({
      success: false,
      message: "올바른 위젯 URL을 입력해주세요. (위젯 URL은 x8bYmqSVwJY로 끝나야 합니다.)",
    });

  // 기존 쿠기 삭제
  res.clearCookie("login_session");

  // init
  const dynamodb = new awsDynamoDB();
  const idx = widgetUrl.split("/").pop().replace("x8bYmqSVwJY", "");
  let alertbox = await dynamodb.getItem(`ALERTBOX#${idx}`, `ALERTBOX#${idx}`);
  if (!alertbox) {
    // 신규 alertbox 생성
    const uid = await dynamodb.getUniqueUUID("alertbox_uid");
    alertbox = {
      PK: `ALERTBOX#${idx}`,
      SK: `ALERTBOX#${idx}`,
      alertbox_idx: idx,
      alertbox_uid: uid,
      created_at: Date.now(),
    };
    await dynamodb.putItem(alertbox);

    // 신규 alertbox UID 매칭 데이터 생성
    await dynamodb.putItem({
      PK: `ALERTBOX`,
      SK: `UID#${uid}`,
      alertbox_idx: idx,
      created_at: Date.now(),
    });
  }

  // 쿠키 설정
  // 프록시를 통해 쿠기가 넘어가지 않도록 PATH는 dashboard로 제한
  res.cookie("login_session", alertbox.alertbox_uid, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/dashboard",
  });

  // 결과값 반환
  return res.json({
    success: true,
  });
};
