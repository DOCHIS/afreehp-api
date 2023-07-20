module.exports.connect = async (event) => {
  const connectionId = event.requestContext.connectionId
  const sourceIp = event.requestContext.identity.sourceIp

  return { statusCode: 200 }
}

module.exports.disconnect = async (event) => {
  const connectionId = event.requestContext.connectionId
  const sourceIp = event.requestContext.identity.sourceIp

  return { statusCode: 200 }
}

module.exports.message = async (event) => {
  const connectionId = event.requestContext.connectionId
  const sourceIp = event.requestContext.identity.sourceIp

  return { statusCode: 200 }
}