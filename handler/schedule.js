const awsApiGateway = require("../libraries/awsApiGateway");
const awsDynamoDB = require("../libraries/awsDynamodb");

// log용 전역변수
console.log(">> process.env.DEBUG", process.env.DEBUG);
global.log = require("../libraries/log");

exports.handler = async (event, context) => {
  log.info("==== SCHEDULE START ====");

  const apigw = new awsApiGateway();
  const dynamodb = new awsDynamoDB();

  // CONNECTION 정보 조회
  let result = {
    Items: [],
    LastEvaluatedKey: null,
  };
  let items = [];
  do {
    result = await dynamodb.queryItems({
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": `CONNECTION`,
      },
      ProjectionExpression: "SK",
      ExclusiveStartKey: result?.LastEvaluatedKey,
    });
    if (result.Items.length > 0) items = items.concat(result.Items);
  } while (result.LastEvaluatedKey);

  // connection id 별로 정리
  const connections = {};
  for (const item of items) {
    const connectionId = item.SK.split("#")[1];
    if (!connections[connectionId]) {
      connections[connectionId] = [];
    }
    connections[connectionId].push(item.SK);
  }
  log.info("┃handler│schedule│check┃connections", JSON.stringify(connections));

  // 커넥션 별로 반복하면서 check 이벤트 전송
  // 전송 실패시 3회 재시도
  // 3회 재시도 실패시 커넥션 삭제
  for (const connectionId in connections) {
    const connection = connections[connectionId];
    let retry = 0;
    let success = false;
    while (!success && retry < 3) {
      try {
        log.info("┃handler│schedule│check┃send", connectionId);
        await apigw.sendMessage({
          ConnectionId: connectionId,
          Data: "CHECK\t" + connectionId,
        });
        success = true;
      } catch (e) {
        log.error("┃handler│schedule│check┃send fail", connectionId);
        retry++;
      }
    }
    if (success) {
      for (const item of connection) {
        log.info("┃handler│schedule│check┃update", item);
        await dynamodb.updateItem({
          PK: `CONNECTION`,
          SK: item,
          ttl: Math.floor(Date.now() / 1000) + 60 * 6 /* 6분 */,
        });
      }
    } else {
      for (const item of connection) {
        log.info("┃handler│schedule│check┃delete", item);
        await dynamodb.deleteItem({
          PK: `CONNECTION`,
          SK: item,
        });
      }
      log.info("┃handler│schedule│check┃delete", connectionId);
      try {
        await apigw.deleteConnection(connectionId);
      } catch (e) {
        log.error("┃handler│schedule│check┃delete fail", connectionId);
      }
    }
  }

  log.info("==== SCHEDULE END ====");

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: Object.keys(connections).length,
    }),
  };
};
