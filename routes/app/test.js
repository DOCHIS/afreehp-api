const awsDynamoDB = require("../../libraries/awsDynamodb")

/**
 * CMD 이벤트 처리
 * @description 클라로 부터 전달받은 CMD 데이터를 DynamoDB에 저장하고 SQS로 전달하여 멀티캐스트 처리
 */
module.exports = async function (req, res) {
  console.log("━ START CMD")
  const dynamodb = new awsDynamoDB()

  const alertbox_idx = "UpWcmqmX"
  const connectionId = "IjW0oev1oE0CJ8Q="

  /**
   * ALL을 수신받는 커넥션 목록 조회
   */
  const params = {
    KeyConditionExpression: "PK = :PK",
    FilterExpression: "connection_room = :connection_room",
    ExpressionAttributeValues: {
      ":PK": `CONNECTION`,
      ":connection_room": `${alertbox_idx}-ALL`,
    },
    ProjectionExpression: "SK",
  }
  const result = await dynamodb.queryItems(params)

  console.log("━ params", params)
  console.log("━ result", result)
  console.log("━ END CMD")

  res.status(200).json({ result: "success", data: result })
}
