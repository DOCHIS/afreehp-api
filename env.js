module.exports = {
  /**
   * < 경고 >
   * 미래의 나 혹은 이 파일을 볼 다른 사람을 위해.
   *
   * 절대 이 파일에 IAM, 비밀번호 해시 등의 정보를 넣지 마세요.
   * 이 파일은 github 상의 public repository에 올라갑니다.
   *
   * 민감한 정보는 반드시
   * - AWS Systems Manager Parameter Store
   * - Github Secrets
   * 에 넣어야 합니다.
   *
   * IAM 토큰은 유출위험이 있으니 사용하지 마세요.
   * 모든 IAM 권한정보는 serverless.yml을 통해 관리합니다.
   */

  // secrets manager
  AWS_SECRET_MANAGER_REGION: "ap-northeast-2",
  AWS_SECRET_MANAGER_NAME: "afreehp",

  // dynamodb
  AWS_DYNAMODB_REGION: "ap-northeast-2",
  AWS_DYNAMODB_TABLE: "afreehp",
};
