const validateGetActivity = {
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' }
      },
      required: ['userId']
    },
    querystring: {
      page: { type: 'number' },
      pageSize: { type: 'number' },
    }
  }
};

module.exports = {
  validateGetActivity
};
