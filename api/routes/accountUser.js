const { validatePostAuthUser } = require('../validations/authUser');
const { postAccountUser } = require('../controllers/authUserController');

module.exports = async (fastify) => {
  fastify.post('/account/user', validatePostAuthUser, postAccountUser);
};
