const validateDeleteAccountMember = {
  schema: {
    params: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number'
        },
        memberId: {
          type: 'number'
        }
      },
      required: ['accountId', 'memberId']
    }
  }
};

const validatePostAccount = {
  preHandler: [
    function (request, _, done) {
      request.bsCheckPermissions(['create:account'], done)
    }
  ],
  schema: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        members: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['admin', 'user'] },
            }
          }
        },
        name: { type: 'string' },
        placeId: { type: 'string' }
      },
      required: ['name', 'members'],
    },
  },
}

const validatePostAccountMemberAdd = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['admin', 'user'] }
      },
      required: ['email', 'role']
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'number'}
      },
      required: ['id']
    }
  }
}

const validatePutAccountMember = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['admin', 'user'] }
      }
    },
    params: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        memberId: { type: 'number' }
      },
      required: ['accountId', 'memberId']
    }
  }
}

module.exports = {
  validateDeleteAccountMember,
  validatePostAccount,
  validatePostAccountMemberAdd,
  validatePutAccountMember
}
