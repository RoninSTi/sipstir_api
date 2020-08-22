const { User } = require('../db/db')

const validatePostAuthFacebook = {
  schema: {
    body: {
      type: 'object',
      properties: {
        fbToken: { type: 'string' }
      },
      required: ['fbToken']
    }
  }
}

const validatePostLogin = {
  preHandler: [
    async function(req) {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        throw new Error('Unauthorized.')
      }

      const isCorrect = user.correctPassword(password)

      if (!isCorrect) {
        throw new Error('Unauthorized.');
      }
    }
  ],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'email' }
    },
    required: ['email', 'password']
  }
}

const validatePostRegister = {
  preHandler: [
    async function (req) {
      const { email } = req.body;

      const user = await User.findOne({
        where: {
          email
        }
      })

      if (user) {
        throw new Error('Unauthorized.')
      }
    }
  ],
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'email' }
    },
    required: ['email', 'password']
  }
}

module.exports = {
  validatePostAuthFacebook,
  validatePostLogin,
  validatePostRegister
}
