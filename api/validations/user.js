const { Account } = require('../models/Account');
const { User } = require('../models/User');

const validateGetCheckUsername = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        username: { type: 'string'}
      },
      required: ['username']
    }
  }
}

const validateGetUser = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' }

      },
      required: ['id']
    }
  }
}

const validateGetUserAccounts = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (request) {
      const { id } = request.params;

      const existingUser = await User.findByPk(id);

      if (!existingUser) {
        throw new Error('Member does not exist.');
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' }
      }
    }
  }
}

const validateGetUserEmail = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' }

      },
      required: ['email']
    }
  }
}

const validatePostUser = {
  preHandler: [
    async function (request) {
      const { accountId, email } = request.body;

      if (accountId) {
        const account = await Account.findByPk(accountId)

        if (!account) {
          throw new Error('Account does not exist.')
        }

        if (account.userId) {
          throw new Error('Account has user.')
        }
      }

      const user = await User.findOne({ where: { email } });

      if (user) {
        throw new Error('User exists.');
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        avatar: { type: 'string', format: 'url' },
        email: { type: 'string', format: 'email' },
        pushToken: { type: 'string' },
        username: { type: 'string'}
      },
      required: ['email'],
    },
  },
}

const validatePostUserFollow = {
  schema: {
    body: {
      type: 'object',
      properties: {
        userId: { type: 'number'}
      },
      required: ['userId']
    },
    params: {
      type: 'object',
      properties: {
        followingId: { type: 'number' }
      },
      required: ['followingId']
    }
  }
}

const validatePutUser = {
  preHandler: [
    async function (request) {
      const { userId } = request.params;

      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User does not exist');
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'url' },
        email: { type: 'string', format: 'email' },
        pushToken: { type: 'string' },
        username: { type: 'string' }
      }
    },
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' }
      },
      required: ['userId']
    }
  }
}

module.exports = {
  validateGetCheckUsername,
  validateGetUser,
  validateGetUserAccounts,
  validateGetUserEmail,
  validatePostUser,
  validatePostUserFollow,
  validatePutUser
}
