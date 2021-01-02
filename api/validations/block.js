const validateGetBlockedUsers = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ]
}

const validatePostBlockUser = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        blockedId: { type: 'number' },
      },
      required: ['blockedId'],
    },
  },
}

module.exports = {
  validateGetBlockedUsers,
  validatePostBlockUser,
}
