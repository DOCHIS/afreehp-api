const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

/**
 * @class awsDynamodb
 * @description 다이나모디비 관련 함수를 모아놓은 클래스
 */
class awsDynamodb {
  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_DYNAMODB_REGION,
    });
    this.table = process.env.AWS_DYNAMODB_TABLE;
  }

  /**
   * get item
   * @param {string} PK 파티션키 (required)
   * @param {string} SK 정렬키 (optional)
   * @returns {object} 결과값
   */
  async getItem(PK, SK) {
    if (!PK) throw new Error("PK is required");
    const params = {
      TableName: this.table,
      Key: marshall({ PK, SK }),
    };
    const command = new GetItemCommand(params);
    const { Item } = await this.client.send(command);
    return unmarshall(Item);
  }

  /**
   * get unique SK
   * @param {string} PK 파티션키 (required)
   * @param {string} SKI 정렬키 식별자 (required)
   *  @example ALERTBOX#{ID}의 아이디를 가져올때는 SK에 "ALERTBOX" 입력
   *  @example CMD#{ID}의 아이디를 가져올때는 SK에 "CMD" 입력
   * @param {number} length SKI의 길이 (optional)
   * @returns {object} 결과값
   */
  async getUniqueSK(PK, SKI, length = 9) {
    if (!PK) throw new Error("PK is required");
    if (!SKI) throw new Error("SKI is required");

    let SK;
    do {
      let rand = [];
      const letters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for (let i = 0; i < length; i++) {
        rand.push(letters[Math.floor(Math.random() * letters.length)]);
      }
      SK = SKI + rand.join("");
    } while (await this.getItem(PK, SK));

    return SK;
  }

  /**
   * put item
   * @param {object} item 저장할 아이템
   *  @param {string} item.PK 파티션키 (required)
   *  @param {string} item.SK 정렬키 (required)
   */
  async putItem(item) {
    if (!item.PK) throw new Error("PK is required");
    if (!item.SK) throw new Error("SK is required");
    const params = {
      TableName: this.table,
      Item: marshall(item),
    };
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}

module.exports = awsDynamodb;
