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
const uuidv4 = require("uuid").v4;

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
   * @description 파티션키와 정렬키를 통해 아이템을 가져옵니다.
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
    if (!Item) return false;
    return unmarshall(Item);
  }

  /**
   * get items by SK starts with
   * @description 정렬키가 특정 문자열로 시작하는 아이템들을 가져옵니다.
   * @param {string} PK 파티션키 (required)
   * @param {string} SK 정렬키 (required)
   * @returns {Object|Flase} 결과값
   *  @param {Array} result 아이템들
   *  @param {string} LastEvaluatedKey 다음 페이지가 있는지 확인하기 위한 키
   */
  async getItemsBySKStartsWith(PK, SK) {
    if (!PK) throw new Error("PK is required");
    if (!SK) throw new Error("SK is required");
    const params = {
      TableName: this.table,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
      ExpressionAttributeValues: marshall({ ":PK": PK, ":SK": SK }),
    };
    const command = new QueryCommand(params);
    const { Items } = await this.client.send(command);
    if (!Items || !Items.length) return false;

    return {
      result: Items.map((item) => unmarshall(item)),
      LastEvaluatedKey: Items.LastEvaluatedKey,
    };
  }

  /**
   * get unique SK
   * @description 중복되지 않는 정렬키를 생성합니다.
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
   * get unique PK
   * @description 전체 파티션에 걸쳐 중복되지 않는 uuid를 생성합니다.
   * @warning PK나 SK에 사용하는 키는 getUniqueSK를 사용하세요.
   * @param {string} use 어디에 이 키를 사용할지 (optional)
   *  @example alertbox_uid
   * @returns {object} 결과값
   */
  async getUniqueUUID(use = null) {
    let ID;
    let uuid_count = 0;
    do {
      ID = "UUID#" + uuidv4();
      uuid_count++;
    } while (await this.getItem(ID, ID));

    this.putItem({
      PK: ID,
      SK: ID,
      uuid_count,
      uuid_use: use,
      created_at: Date.now(),
    });

    return ID.split("#").pop();
  }

  /**
   * put item
   * @description 아이템을 저장합니다.
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

  /**
   * update item
   * @description 아이템을 업데이트합니다.
   * @param {object} item 업데이트할 아이템
   * @param {string} item.PK 파티션키 (required)
   * @param {string} item.SK 정렬키 (required)
   * @param {*}      item.ANY 업데이트할 값
   * @returns {object} 결과값
   */
  async updateItem(item) {
    if (!item.PK) throw new Error("PK is required");
    if (!item.SK) throw new Error("SK is required");

    const data = { ...item };
    delete data.PK;
    delete data.SK;
    if (Object.keys(data).length == 0)
      throw new Error("Update data is required");

    let UpdateExpression = "SET";
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    let i = 0;
    for (const [key, value] of Object.entries(data)) {
      UpdateExpression += ` #${key} = :${key},`;
      ExpressionAttributeNames[`#${key}`] = key;
      ExpressionAttributeValues[`:${key}`] = value;
      i++;
    }

    UpdateExpression = UpdateExpression.slice(0, -1);

    const params = {
      TableName: this.table,
      Key: marshall({ PK: item.PK, SK: item.SK }),
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    const command = new UpdateItemCommand(params);
    await this.client.send(command);

    return true;
  }

  /**
   * save item
   * @description PK와 SK를 통해 아이템이 존재하면 업데이트하고, 존재하지 않으면 새로 생성합니다.
   * @param {object} item 저장할 아이템
   * @param {string} item.PK 파티션키 (required)
   * @param {string} item.SK 정렬키 (required)
   * @returns {object} 결과값
   */
  async saveItem(item) {
    if (!item.PK) throw new Error("PK is required");
    if (!item.SK) throw new Error("SK is required");

    if (await this.getItem(item.PK, item.SK)) {
      await this.updateItem(item);
    } else {
      await this.putItem(item);
    }
  }
}

module.exports = awsDynamodb;
