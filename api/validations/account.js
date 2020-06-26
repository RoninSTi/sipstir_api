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
            type: 'string',
            format: 'email'
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
        members: {
          type: 'array',
          items: {
            type: 'string',
            format: 'email'
          }
        }
      },
      required: ['members']
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

module.exports = {
  validateDeleteAccountMember,
  validatePostAccount,
  validatePostAccountMemberAdd
}
