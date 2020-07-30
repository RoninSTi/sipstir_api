const validatePostAuthFacebook = {
  schema: {
    body: {
      type: 'object',
      properties: {
        fbToken: { type: 'string' }
      },
      required: ['fbToken']
    }
  }
}

module.exports = {
  validatePostAuthFacebook
}
