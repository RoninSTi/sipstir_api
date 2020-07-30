const validatePostGuessComment = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        createdById: { type: 'number' }
      },
      required: ['text', 'createdById']
    },
    params: {
      type: 'object',
      properties: {
        guessId: { type: 'number' }
      },
      required: ['guessId']
    }
  }
};

module.exports = {
  validatePostGuessComment
};
