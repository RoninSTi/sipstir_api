const { Account } = require('../models/Account');
const { Reward } = require('../models/Reward');

const validateGetAccountRewards = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
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
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        isActive: { type: 'boolean' },
        discount: { type: 'number' },
        image: { type: 'string', format: 'url'},
        message: { type: 'string' },
        name: { type: 'string' },
        points: { type: 'number' },
        subject: { type: 'string' }
      },
      required: ['accountId', 'discount', 'points'],
    },
  },
}

const validatePutReward = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { rewardId } = req.params;

      const reward = await Reward.findByPk(rewardId);

      if (!reward) {
        throw new Error('Reward does not exist');
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean' },
        discount: { type: 'number' },
        image: { type: 'string', format: 'url' },
        message: { type: 'string' },
        name: { type: 'string' },
        points: { type: 'number' },
        subject: { type: 'string' }
      },
      required: ['discount', 'points'],
    },
    params: {
      type: 'object',
      properties: {
        rewardId: { type: 'number'}
      },
      required: ['rewardId']
    }
  },
}

module.exports = {
  validateGetAccountRewards,
  validatePostReward,
  validatePutReward
}
