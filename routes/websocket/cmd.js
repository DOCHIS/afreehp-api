const awsApiGateway = require("../../libraries/awsApiGateway")
const awsDynamoDB = require("../../libraries/awsDynamodb")
const { v4: uuidv4 } = require("uuid")

/**
 * CMD 이벤트 처리
 * @description 클라로 부터 전달받은 CMD 데이터를 DynamoDB에 저장하고 SQS로 전달하여 멀티캐스트 처리
 */
module.exports = async function (data, event, connection) {
  console.log("━ START CMD")

  const apigw = new awsApiGateway()
  const dynamodb = new awsDynamoDB()
  const nanoTime = process.hrtime.bigint().toString()
  const SK = `CMD#${nanoTime}#${uuidv4()}`
  const cmd = JSON.parse(data)

  // log
  console.log(
    "━ params",
    JSON.stringify({
      SK,
      cmd,
    })
  )

  // CMD TTL
  const TTL =
    process.env.STAGE === "dev"
      ? 60 * 60 * 24 * 7 // 7일
      : 60 * 60 * 24 * 30 // 30일

  // CMD 기록
  await dynamodb.putItem({
    PK: `ALERTBOX#${connection.alertbox_idx}`,
    SK: SK,
    cmd,
    alertbox_idx: connection.alertbox_idx,
    created_at: Date.now(),
    ttl: Math.floor(Date.now() / 1000) + TTL,
  })
  console.log("━ CMD saved")

  // 이 CMD를 수신받을 커넥션 목록 만들기
  let recvers = []
  try {
    /**
     * ALL을 수신받는 커넥션 목록 조회
     */
    const allRecvers = await dynamodb.queryItems({
      KeyConditionExpression: "PK = :PK",
      FilterExpression: "connection_room = :connection_room",
      ExpressionAttributeValues: {
        ":PK": `CONNECTION`,
        ":connection_room": `${connection.alertbox_idx}-ALL`,
      },
      ProjectionExpression: "SK",
    })
    if (allRecvers.Items.length > 0) {
      for (const allRecver of allRecvers.Items) {
        recvers.push(allRecver.SK)
      }
    }

    /**
     * cmd.type을 수신받는 커넥션 목록 조회
     * PK = CONNECTION, SK #ROOM#<connectionId>-type 로 끝나는 커넥션 목록 조회
     */
    const typeRecvers = await dynamodb.queryItems({
      KeyConditionExpression: "PK = :PK",
      FilterExpression: "connection_room = :connection_room",
      ExpressionAttributeValues: {
        ":PK": `CONNECTION`,
        ":connection_room": `${connection.alertbox_idx}-${cmd.type}`,
      },
      ProjectionExpression: "SK",
    })
    if (typeRecvers.Items.length > 0) {
      for (const typeRecver of typeRecvers.Items) {
        recvers.push(typeRecver.SK)
      }
    }

    // SK 중복 제거
    recvers = [...new Set(recvers)]
    console.log("━ recvers", recvers)

    // 소켓 발송
    for (const recver of recvers) {
      const split = recver.split("#")
      const connectionId = split[1]

      try {
        const params = {
          ConnectionId: connectionId,
          Data: "CMD\t" + data,
        }
        console.log("━ recverParams", params)
        await apigw.sendMessage(params)
      } catch (e) {
        console.log(e)
      }
    }
  } catch (e) {
    console.log(e)
  }
}