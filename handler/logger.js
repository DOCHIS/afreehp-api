const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const zlib = require("zlib");
const uuid = require("uuid");

exports.handler = async (event, context) => {
  try {
    const data = Buffer.from(event.awslogs.data, "base64");
    const payload = JSON.parse(zlib.gunzipSync(data).toString("utf8"));
    console.log(">> payload", payload);

    const { logGroup, messageType, logStream } = payload;
    const logGroupSplit = logGroup.split("-");
    const stage = logGroupSplit[2];
    const ttl = 60 * 60 * 24 * 30; // 30 days

    console.log(">> data", event.awslogs.data);
    console.log(">> length:", payload.logEvents.length);
    if (payload.logEvents.length > 0) {
      for (const logEvent of payload.logEvents) {
        const message = logEvent.message;
        const messageSplit = logEvent.message.split("\t");
        const messageNL = logEvent.message.split("\n");
        const messageFirstLine = messageNL[0];

        const request_id = messageSplit[1];
        const message_type = messageSplit[2];

        console.log(">> ", request_id, messageFirstLine);

        const timestamp = logEvent.timestamp;
        const timestampS = parseInt(timestamp / 1000);
        const timestampMs = timestamp % 1000;

        const dynamodb = new DynamoDBClient({ region: "ap-northeast-2" });
        const params = {
          TableName: "afreehp-log-" + stage,
          Item: {
            id: { S: timestamp + "-" + uuid.v4() },
            request_id: { S: request_id },
            message_type: { S: message_type },
            message: { S: message },
            timestamp: { N: timestamp.toString() },
            timestampS: { N: timestampS.toString() },
            timestampMs: { N: timestampMs.toString() },
            ttl: { N: (timestampS + ttl).toString() },
            _ttl: { N: ttl.toString() },
            _messageType: { S: messageType },
            _logGroup: { S: logGroup },
            _logStream: { S: logStream },
          },
        };

        console.log(">> params", params);

        const command = new PutItemCommand(params);
        await dynamodb.send(command);
      }
    }
  } catch (e) {
    console.log(">> error!!", e);
  }

  console.log(">> done");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
};
