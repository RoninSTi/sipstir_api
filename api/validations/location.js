const validatePostLocationId = {
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
