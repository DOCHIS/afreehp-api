const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
} = require("@aws-sdk/client-apigatewaymanagementapi");

class awsApiGateway {
  /**
   * 생성자
   */
  constructor() {
    log.info("┃libraries│awsApiGateway│constructor");
    this.apigwManagementApi = new ApiGatewayManagementApiClient({
      endpoint: process.env.APIG_ENDPOINT,
      region: process.env.APIG_REGION,
    });
  }

  /**
   * 소켓에 메시지 전송
   * @description API GAteWay를 통해 소켓에 메시지를 전송한다.
   * @param {Object} response
   *  @param {String} response.ConnectionId - 소켓 커넥션 아이디
   *  @param {String} response.Data - 전송할 데이터
   * @returns {Promise}
   */
  async sendMessage(response) {
    log.info("┃libraries│awsApiGateway│sendMessage");
    log.info("┃libraries│awsApiGateway│sendMessage┃response", response);
    return await this.apigwManagementApi.send(
      new PostToConnectionCommand({
        ConnectionId: response.ConnectionId,
        Data: response.Data,
      })
    );
  }

  /**
   * 소켓 연결 삭제
   * @description API GAteWay를 통해 소켓 연결을 삭제한다.
   * @param {String} connectionId - 소켓 커넥션 아이디
   * @returns {Promise}
   */
  async deleteConnection(connectionId) {
    log.info("┃libraries│awsApiGateway│deleteConnection");
    log.info("┃libraries│awsApiGateway│deleteConnection┃connectionId", connectionId);
    return await this.apigwManagementApi.send(
      new DeleteConnectionCommand({
        ConnectionId: connectionId,
      })
    );
  }
}

module.exports = awsApiGateway;
