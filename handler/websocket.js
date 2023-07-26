const awsDynamoDB = require("../libraries/awsDynamodb");
const awsApiGateway = require("../libraries/awsApiGateway");

// log용 전역변수
console.log(">> process.env.DEBUG", process.env.DEBUG);
global.log = require("../libraries/log");

const apigw = new awsApiGateway();
const dynamodb = new awsDynamoDB();

// 소켓 커넥션
module.exports.connect = async (event) => {
  log.info("==== WEB SOCKET START ====");
  log.info("┃handler│websocket│connect┃event", event);
  log.info("┃handler│websocket│connect");
  return { statusCode: 200 };
};

module.exports.disconnect = async (event) => {
  log.info("==== WEB SOCKET START ====");
  log.info("┃handler│websocket│disconnect┃event", event);
  log.info("┃handler│websocket│disconnect");

  const connectionId = event.requestContext.connectionId;
  log.info("┃handler│websocket│disconnect┃connectionId", connectionId);

  // 커넥션 정보 조회
  const connection = await dynamodb.queryItems({
    KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `CONNECTION`,
      ":SK": `CONNECTION#${connectionId}`,
    },
    ProjectionExpression: "SK",
  });
  log.info("┃handler│websocket│disconnect┃connection", connection);

  if (connection.Items.length > 0) {
    for (const item of connection.Items) {
      await dynamodb.deleteItem({
        PK: `CONNECTION`,
        SK: item.SK,
      });
    }
  }

  return { statusCode: 200 };
};

module.exports.message = async (event) => {
  log.info("==== WEB SOCKET START ====");
  log.info("┃handler│websocket│message┃event", event);
  log.info("┃handler│websocket│message");

  const body = event.body;
  log.info("┃handler│websocket│message┃body", body);

  const connectionId = event.requestContext.connectionId;
  const command = body.split("\t")[0];
  const data = body.split("\t")[1];

  if (command == "JOIN") {
    log.info("┃handler│websocket│message┃JOIN", data, event);
    await require("../routes/websocket/join")(data, event);
  } else {
    log.info("┃handler│websocket│message┃command", command);

    // 커넥션 정보 조회
    const connection = await dynamodb.getItem(
      `CONNECTION`,
      `CONNECTION#${connectionId}`
    );
    log.info("┃handler│websocket│message┃connection", connection);

    if (connection) {
      // 라우팅
      log.info("┃handler│websocket│message┃routing", command);
      switch (command) {
        case "CMD":
          await require("../routes/websocket/cmd")(data, event, connection);
          break;
        case "PING":
          await require("../routes/websocket/ping")(data, event, connection);
          break;
      }
    } else {
      log.info("┃handler│websocket│message┃connection not found", connectionId);
      try {
        await apigw.deleteConnection(connectionId);
      } catch (e) {
        log.error("┃handler│websocket│message┃deleteConnection error", e);
      }
    }
  }

  log.info("┃handler│websocket│message┃end");
  return { statusCode: 200 };
};
