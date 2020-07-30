const validatePostSignedUrl = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        fileName: { type: 'string' },
        fileType: { type: 'string' },
      },
      required: ['fileName', 'fileType']
    }
  }
}

module.exports = {
  validatePostSignedUrl
}
