const validatePostLocationId = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        placeId: { type: 'string' },
      },
      required: ['placeId'],
    },
  },
}

module.exports = {
  validatePostLocationId
}
