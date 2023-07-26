const awsApiGateway = require("../../libraries/awsApiGateway");

/**
 * PING 이벤트 처리
 * @description PONG !
 */
module.exports = async function (data, event) {
  const apigw = new awsApiGateway();
  return await apigw.sendMessage({
    ConnectionId: connectionId,
    Data: "PING\tPONG",
  });
};
