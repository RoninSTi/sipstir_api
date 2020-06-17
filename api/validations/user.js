const validateGetCheckUsername = {
  schema: {
    params: {
      type: 'object',
      properties: {
        username: { type: 'string' }
      },
      required: ['username']
    }
  }
}

const validatePostUser = {
  schema: {
    body: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'url' },
        email: { type: 'string', format: 'email' },
        username: { type: 'string' }
      },
      required: ['email', 'username'],
    },
  },
}

module.exports = {
  validateGetCheckUsername,
  validatePostUser
}