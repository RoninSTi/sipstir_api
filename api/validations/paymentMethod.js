const { Account } = require('../db/db')

const validatePostPaymentMethod = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { accountId } = req.body;

      const account = await Account.findByPk(accountId);

      if (!account) {
        throw new Error('Account does not exist');
      }
    },
    async function (req) {
      const { accounts } = req.user
      const { accountId } = req.body

      const canAccess = accounts.some(account => account.accountId === accountId)

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }

      const isSuperAdmin = accounts.some(account => account.accountId === accountId && account.role === 'super-admin')

      if (!isSuperAdmin) {
        throw new Error('Super admin function')
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        customerId: { type: 'string' },
        paymentMethodId: { type: 'string' },
      },
      required: ['accountId', 'customerId', 'paymentMethodId']
    }
  }
}

module.exports = {
  validatePostPaymentMethod
}
