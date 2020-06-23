const { Member } = require('../models/Member');

const validateGetMemberAccounts = {
  preHandler: [
    async function (request, _, done) {
      const { id } = request.params;

      const existingUser = await Member.findByPk(1);

      if (existingUser) {
        done()
      } else {
        done(new Error('Member does not exist.'));
      }
    }
  ],
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'number'}
      }
    }
  }
}

const validatePostMember = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  },
}

module.exports = {
  validateGetMemberAccounts,
  validatePostMember
}
