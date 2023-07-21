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
      message: "위젯 URL이 아프리카 도우미 위젯 URL이 아닙니다.",
    });

  // 위젯 URL 검증
  if (!widgetUrl.endsWith("x8bYmqSVwJY"))
    return res.json({
      success: false,
      message: "올바른 위젯 URL을 입력해주세요.",
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

  // API 접근용 엑세스 토큰이 없다면 생성
  const access_token = await dynamodb.getItemsBySKStartsWith(
    `ALERTBOX#${idx}`,
    "ACCESSTOKEN#"
  );
  if (!access_token) {
    const accessToken = await dynamodb.getUniqueUUID('ACCESSTOKEN');
    await dynamodb.putItem({
      PK: `ALERTBOX#${idx}`,
      SK: `ACCESSTOKEN#${accessToken}`,
      access_token: accessToken,
      created_at: Date.now(),
    });
  }

  // 쿠키 설정
  res.cookie("login_session", alertbox.alertbox_uid, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  // 결과값 반환
  return res.json({
    success: true,
  });
};
