const validateDeleteAccount = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
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
  schema: {
    body: {
      type: 'object',
      properties: {
        contactName: { type: 'string' },
        email: {
          type: 'string',
          format: 'email'
        },
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

const validatePutAccountUser = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify()
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
  validatePutAccountUser
}
