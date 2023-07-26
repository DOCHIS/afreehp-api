const awsApiGateway = require("../../libraries/awsApiGateway")
const awsDynamoDB = require("../../libraries/awsDynamodb")

/**
 * CMD 이벤트 처리
 * @description 클라로 부터 전달받은 CMD 데이터를 DynamoDB에 저장하고 SQS로 전달하여 멀티캐스트 처리
 */
module.exports = async function (data, event) {
  const apigw = new awsApiGateway()
  const dynamodb = new awsDynamoDB()

  const { alertbox_idx, rooms } = JSON.parse(data)
  const connectionId = event.requestContext.connectionId

  console.log("JOIN", alertbox_idx, rooms)

  // 인증 처리
  const alertbox = await dynamodb.getItem(
    `ALERTBOX#${alertbox_idx}`,
    `ALERTBOX#${alertbox_idx}`
  )

  if (!alertbox) {
    return await apigw.sendMessage({
      ConnectionId: connectionId,
      Data: "JOIN\tFAIL",
    })
  }

  // 커넥션 정보 생성
  await dynamodb.saveItem({
    PK: `CONNECTION`,
    SK: `CONNECTION#${connectionId}`,
    ttl: Math.floor(Date.now() / 1000) + 60 * 6 /* 6분 */,
    alertbox_idx: alertbox_idx,
    connection_id: connectionId,
    connection_time: Date.now(),
  })

  // 해당 커넥션의 기존 ROOMS 정보 조회 및 삭제
  const connectionRooms = await dynamodb.queryItems({
    KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `CONNECTION`,
      ":SK": `CONNECTION#${connectionId}#ROOM#`,
    },
    ProjectionExpression: "SK",
  })
  if (connectionRooms.Items.length > 0) {
    for (const connectionRoom of connectionRooms.Items) {
      await dynamodb.deleteItem(`CONNECTION`, connectionRoom.SK)
    }
  }

  // rooms 중복 제거
  const uniqueRooms = [...new Set(rooms)]

  // 룸 요청이 50개 초과면 에러
  if (uniqueRooms.length > 50) {
    return await apigw.sendMessage({
      ConnectionId: connectionId,
      Data: "JOIN\tFAIL",
    })
  }

  // 커넥션 ROOMS 정보 생성
  for (const room of uniqueRooms) {
    await dynamodb.putItem({
      PK: `CONNECTION`,
      SK: `CONNECTION#${connectionId}#ROOM#${room}`,
      connection_room: room,
      alertbox_idx: alertbox_idx,
      connection_id: connectionId,
      connection_time: Date.now(),
      ttl: Math.floor(Date.now() / 1000) + 60 * 6 /* 6분 */,
    })
  }
}
