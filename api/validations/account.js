const { Account } = require('../db/db')

const validateDeleteAccount = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { roles } = req.user

      const isEmployee = roles.some(role => role === 'employee')

      if (!isEmployee) throw new Error('Unauthorized.')
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number'
        },
      },
      required: ['accountId']
    }
  }
};

const validateDeleteAccountUser = {
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
    },
    async function (req) {
      const { accounts } = req.user
      const { accountId } = req.params

      const canAccess = accounts.some(account => account.accountId === accountId)

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number'
        },
        userId: {
          type: 'number'
        }
      },
      required: ['accountId', 'userId']
    }
  }
};

const validateGetAccounts = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  schema: {
    querystring: {
      page: { type: 'number' },
      pageSize: { type: 'number' },
    }
  }
};

const validatePostAccount = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
    }
  ],
  preHandler: [
    async function (req) {
      const { roles } = req.user

      const isEmployee = roles.some(role => role === 'employee')

      if (!isEmployee) throw new Error('Unauthorized.')
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        contactName: { type: 'string' },
        email: {
          type: 'string',
          format: 'email'
        },
        image: { type: ['string', 'null'], format: 'url' },
        name: { type: 'string' },
        placeId: { type: 'string' },
        phone: { type: 'string' }
      },
      required: ['contactName', 'email', 'name', 'phone', 'placeId'],
    },
  },
}

const validatePostAccountUserAdd = {
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
    },
    async function (req) {
      const { accounts } = req.user
      const { accountId } = req.params

      const canAccess = accounts.some(account => account.accountId === accountId)

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['admin', 'super-admin'] }
      },
      required: ['email', 'role']
    },
    params: {
      type: 'object',
      properties: {
        accountId: { type: 'number'}
      },
      required: ['accountId']
    }
  }
}

const validatePutAccount = {
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
    },
    async function (req) {
      const { accounts, roles } = req.user
      const { accountId } = req.params

      const isEmployee = roles.some(role => role === 'employee')

      if (!isEmployee) {
        const canAccess = accounts.some(account => account.accountId === accountId)

        if (!canAccess) {
          throw new Error('Not a member of the account')
        }
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        contactName: { type: 'string' },
        email: {
          type: 'string',
          format: 'email'
        },
        image: { type: ['string', 'null'], format: 'url' },
        name: { type: 'string' },
        placeId: { type: 'string' },
        phone: { type: 'string' }
      }
    },
    params: {
      type: 'object',
      properties: {
        accountId: { type: 'number' }
      },
      required: ['accountId']
    }
  },
}

const validatePutAccountUser = {
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
    },
    async function (req) {
      const { accounts } = req.user
      const { accountId } = req.params

      const canAccess = accounts.some(account => account.accountId === accountId)

      if (!canAccess) {
        throw new Error('Not a member of the account')
      }
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        role: {
          type: 'string', enum: ['admin', 'super-admin'] }
      }
    },
    params: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        userId: { type: 'number' }
      },
      required: ['accountId', 'userId']
    }
  }
}

module.exports = {
  validateDeleteAccount,
  validateDeleteAccountUser,
  validateGetAccounts,
  validatePostAccount,
  validatePostAccountUserAdd,
  validatePutAccount,
  validatePutAccountUser
}
