const validatePostSignedUrl = {
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
