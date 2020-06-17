const validatePostAuthUser = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  },
}

module.exports = {
  validatePostAuthUser
}
