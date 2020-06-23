const { Account } = require('../models/Account');
const { User } = require('../models/User');

validateGetCheckUsername = {
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

const validatePostUser = {
  preHandler: [
    async function (request) {
      const { accountId, email, username } = request.body;

      if (accountId) {
        const account = await Account.findByPk(accountId)

        if (!account) {
          throw new Error('Account does not exist.')
        }

        if (account.userId) {
          throw new Error('Account has user.')
        }
      }

      const existingUser = await User.findOne({
        where: {
          email, username
        }
      });

      if (existingUser) {
        throw new Error('User exists');
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        accountId: { type: 'number'},
        avatar: { type: 'string', format: 'url'},
        email: { type: 'string', format: 'email' },
        pushToken: { type: 'string' },
        username: { type: 'string'}
      },
      required: ['email', 'username'],
    },
  },
}

module.exports = {
  validateGetCheckUsername,
  validatePostUser
}
