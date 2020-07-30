const validatePostSubscription = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: {type: 'number'},
        customerId: { type: 'string' },
        paymentMethodId: { type: 'string' },
        priceId: { type: 'string' }
      },
      required: ['customerId', 'paymentMethodId', 'priceId'],
    },
  },
}

module.exports = {
  validatePostSubscription
}
