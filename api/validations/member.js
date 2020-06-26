const { Member } = require('../models/Member');

const validateGetMemberAccounts = {
  preHandler: [
    async function (request) {
      const { id } = request.params;

      const existingUser = await Member.findByPk(id);

      if (!existingUser) {
        throw new Error('Member does not exist.');
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
