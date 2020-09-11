const { Account, Subscription } = require('../db/db')

const validateDeleteSubscription = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { subscriptionId } = req.params;

      const subscription = await Subscription.findByPk(subscriptionId);

      if (!subscription) {
        throw new Error('Subscription does not exist');
      }
    },
    async function (req) {
      const { accounts } = req.user
      const { subscriptionId } = req.params

      const subscription = await Subscription.findByPk(subscriptionId);

      const canAccess = accounts.some(account => account.accountId === subscription.accountId)

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }

      const isSuperAdmin = accounts.some(account => account.accountId === subscription.accountId && account.role === 'super-admin')

      if (!isSuperAdmin) {
        throw new Error('Super admin function')
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        subscriptionId: { type: 'number' },
      },
      required: ['subscriptionId'],
    },
  },
}

const validatePostSubscription = {
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
  validateDeleteSubscription,
  validatePostSubscription
}
