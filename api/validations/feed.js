const validateGetFeed = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        feedType: { type: 'string', enum: ['following', 'main', 'user'] },
        userId: { type: 'number' }
      },
      required: ['feedType', 'userId']
    },
    querystring: {
      page: { type: 'number' },
      pageSize: { type: 'number' },
    }
  }
};

module.exports = {
  validateGetFeed
};
