const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
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
    log.info("┃libraries│awsDynamodb│constructor");
    this.client = new DynamoDBClient({ region: "ap-northeast-2" });
    this.table = "afreehp-" + process.env.STAGE;
  }

  /**
   * get item
   * @description 파티션키와 정렬키를 통해 아이템을 가져옵니다.
   * @param {string} PK 파티션키 (required)
   * @param {string} SK 정렬키 (optional)
   * @returns {object} 결과값
   */
  async getItem(PK, SK) {
    log.info("┃libraries│awsDynamodb│getItem");
    log.info("┃libraries│awsDynamodb│getItem┃PK", PK);
    log.info("┃libraries│awsDynamodb│getItem┃SK", SK);
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
    log.info("┃libraries│awsDynamodb│getItemsBySKStartsWith");
    log.info("┃libraries│awsDynamodb│getItemsBySKStartsWith┃PK", PK);
    log.info("┃libraries│awsDynamodb│getItemsBySKStartsWith┃SK", SK);
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
    log.info("┃libraries│awsDynamodb│getUniqueSK");
    log.info("┃libraries│awsDynamodb│getUniqueSK┃PK", PK);
    log.info("┃libraries│awsDynamodb│getUniqueSK┃SKI", SKI);
    log.info("┃libraries│awsDynamodb│getUniqueSK┃length", length);

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
    log.info("┃libraries│awsDynamodb│getUniqueUUID");
    log.info("┃libraries│awsDynamodb│getUniqueUUID┃use", use);

    let ID;
    let uuid_count = 0;
    do {
      ID = "UUID#" + uuidv4();
      uuid_count++;
    } while (await this.getItem(ID, ID));

    this.putItem({
      PK: ID,
      SK: ID,
      uuid: ID.split("#").pop(),
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
    log.info("┃libraries│awsDynamodb│putItem");
    log.info("┃libraries│awsDynamodb│putItem┃item", item);

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
   * @param {string} item.SK 정렬키 (optional)
   * @param {*}      item.ANY 업데이트할 값
   * @returns {object} 결과값
   */
  async updateItem(item) {
    log.info("┃libraries│awsDynamodb│updateItem");
    log.info("┃libraries│awsDynamodb│updateItem┃item", item);

    if (!item.PK) throw new Error("PK is required");

    const data = { ...item };
    delete data.PK;
    if (data?.SK) delete data.SK;
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
    return await this.client.send(command);
  }

  /**
   * update item detail
   * @description 아이템 업데이트의 조건을 세분화하여 업데이트합니다.
   * @param {object} Key 파티션키와 정렬키 (required)
   *  @param {string} Key.PK 파티션키 (required)
   *  @param {string} Key.SK 정렬키 (optional)
   * @param {object} UpdateExpression 업데이트할 내용의 키 (required)
   *  @example "SET #key = :value"
   * @param {object} ConditionExpression 업데이트할 조건 (required)
   *  @example "attribute_exists(#key)"
   * @param {object} ExpressionAttributeValues 업데이트할 내용의 값 (required)
   *  @example { ":value": "value" }
   * @param {object} ExpressionAttributeNames 업데이트할 조건의 키 (required)
   *  @example { "#key": "key" }
   * @returns {object} 결과값
   */
  async updateItemDetail(
    Key,
    UpdateExpression,
    ConditionExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames
  ) {
    log.info("┃libraries│awsDynamodb│updateItemDetail");
    log.info("┃libraries│awsDynamodb│updateItemDetail┃Key", Key);
    log.info(
      "┃libraries│awsDynamodb│updateItemDetail┃UpdateExpression",
      UpdateExpression
    );
    log.info(
      "┃libraries│awsDynamodb│updateItemDetail┃ConditionExpression",
      ConditionExpression
    );
    log.info(
      "┃libraries│awsDynamodb│updateItemDetail┃ExpressionAttributeValues",
      ExpressionAttributeValues
    );
    log.info(
      "┃libraries│awsDynamodb│updateItemDetail┃ExpressionAttributeNames",
      ExpressionAttributeNames
    );

    if (!Key.PK) throw new Error("PK is required");
    if (!Key.SK) throw new Error("SK is required");
    if (!UpdateExpression) throw new Error("UpdateExpression is required");
    if (!ConditionExpression)
      throw new Error("ConditionExpression is required");
    if (!ExpressionAttributeValues)
      throw new Error("ExpressionAttributeValues is required");
    if (!ExpressionAttributeNames)
      throw new Error("ExpressionAttributeNames is required");

    const params = {
      TableName: this.table,
      Key: marshall(Key),
      UpdateExpression,
      ConditionExpression,
      ExpressionAttributeValues: marshall(ExpressionAttributeValues),
      ExpressionAttributeNames,
    };

    const command = new UpdateItemCommand(params);
    return await this.client.send(command);
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
    log.info("┃libraries│awsDynamodb│saveItem");
    log.info("┃libraries│awsDynamodb│saveItem┃item", item);

    if (!item.PK) throw new Error("PK is required");
    if (!item.SK) throw new Error("SK is required");

    if (await this.getItem(item.PK, item.SK)) {
      await this.updateItem(item);
    } else {
      await this.putItem(item);
    }
  }

  /**
   * delete items
   * @description PK와 PK 혹슨 PK를 통해 아이템을 삭제합니다.
   * @param {object} Key 파티션키와 정렬키 (required)
   *  @param {string} Key.PK 파티션키 (required)
   *  @param {string} Key.SK 정렬키 (optional)
   * @returns {object} 결과값
   */
  async deleteItem(Key) {
    log.info("┃libraries│awsDynamodb│deleteItem");
    log.info("┃libraries│awsDynamodb│deleteItem┃Key", Key);

    if (!Key.PK) throw new Error("PK is required");

    const params = {
      TableName: this.table,
      Key: marshall(Key),
    };

    const command = new DeleteItemCommand(params);
    return await this.client.send(command);
  }

  /**
   * query item
   * @description 쿼리를 통해 아이템을 가져옵니다.
   * @example 파라미터의 예시는 https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/dynamodb/actions/document-client/query.js#L8 를 참고하세요.
   * @param {Object} params (required)
   * @param {Object} params.KeyConditionExpression (required)
   * @param {Object} params.ExpressionAttributeValues (required)
   * @param {Object} params.FilterExpression (optional)
   * @param {Object} params.ProjectionExpression (optional)
   * @param {Object} params.ExclusiveStartKey (optional)
   * @param {Object} params.ConsistentRead (optional)
   * @param {Object} params.Limit (optional)
   * @returns {object}
   */
  async queryItems(params) {
    log.info("┃libraries│awsDynamodb│queryItems");
    log.info("┃libraries│awsDynamodb│queryItems┃params", params);

    if (!params.KeyConditionExpression)
      throw new Error("KeyConditionExpression is required");
    if (!params.ExpressionAttributeValues)
      throw new Error("ExpressionAttributeValues is required");

    params.TableName = this.table;
    params.ExpressionAttributeValues = marshall(
      params.ExpressionAttributeValues
    );

    const command = new QueryCommand(params);
    const data = await this.client.send(command);

    console.log("data", data);
    return {
      Items: data.Items.map((item) => unmarshall(item)),
      LastEvaluatedKey: data.LastEvaluatedKey,
    };
  }
}

module.exports = awsDynamodb;
