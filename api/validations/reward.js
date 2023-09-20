const { Account, Reward } = require('../db/db');

const validateDeleteReward = {
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
    },
    async function (req) {
      const canAccess = await Reward.canAccess({ req })

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }
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

const validateGetRedemptions = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId']
    }
  }
}

const validateGetRewards = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    querystring: {
      type: 'object',
      properties: {
        lat: { type: 'number'},
        lng: { type: 'number' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
        radius: { type: 'number' },
        search: { type: 'string' }
      }
    }
  }
}

const validatePostReward = {
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
      const canAccess = await Reward.canAccess({ req })

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }
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

const validatePostRewardRedeem = {
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

      if (!reward.isActive) {
        throw new Error('Reward is not active');
      }
    },
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        rewardId: { type: 'number' },
      },
      required: ['rewardId'],
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
    },
    async function (req) {
      const canAccess = await Reward.canAccess({ req })

      if (!canAccess) {
        throw new Error('Not a member of the account')
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
  validateGetRedemptions,
  validateGetRewards,
  validatePostReward,
  validatePostRewardRedeem,
  validatePutReward
}
