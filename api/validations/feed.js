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
        feedType: { type: 'string', enum: ['following', 'main', 'nearby', 'user'] },
        userId: { type: 'number' }
      },
      required: ['feedType', 'userId']
    },
    querystring: {
      lat: { type: 'number' },
      lng: { type: 'number' },
      page: { type: 'number' },
      pageSize: { type: 'number' },
      radius: { type: 'number' }
    }
  }
};

module.exports = {
  validateGetFeed
};
