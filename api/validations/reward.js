const { Account } = require('../models/Account');

const validateGetAccountRewards = {
  preHandler: [
    async function (req) {
      const { accountId } = req.params;

      const account = await Account.findByPk(accountId);

      if (!account) {
        throw new Error('Account does not exist');
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        accountId: { type: 'number'}
      },
      required: ['accountId']
    }
  }
}

const validatePostReward = {
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        isActive: { type: 'bool' },
        discount: { type: 'number' },
        image: { type: 'string', format: 'url'},
        message: { type: 'string' },
        points: { type: 'number' },
        subject: { type: 'string' }
      },
      required: ['accountId', 'discount', 'points'],
    },
  },
}

module.exports = {
  validateGetAccountRewards,
  validatePostReward
}
