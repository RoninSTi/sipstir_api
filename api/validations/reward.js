const { Account, Reward } = require('../db/db');

const validateDeleteReward = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        rewardId: { type: 'number'}
      },
      required: ['rewardId']
    }
  }
}

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
        message: { type: 'string' },
        points: { type: 'number' },
        title: { type: 'string' }
      },
      required: ['accountId', 'message', 'points', 'title'],
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
        message: { type: 'string' },
        points: { type: 'number' },
        title: { type: 'string' }
      },
      required: ['message', 'points', 'title'],
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
  validateDeleteReward,
  validateGetAccountRewards,
  validatePostReward,
  validatePutReward
}
