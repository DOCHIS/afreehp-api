exports.handler = async (event) => {
  log.debug("┠ event:", JSON.stringify(event));
  return {
    statusCode: 200,
    body: "OK",
  };
};
