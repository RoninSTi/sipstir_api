const { validateGetCheckUsername, validatePostUser } = require('../validations/user');
const { getCheckUsername, postUser } = require('../controllers/userController');

module.exports = async (fastify) => {
  fastify.get('/user/check/:username', validateGetCheckUsername, getCheckUsername);
  fastify.post('/user', validatePostUser, postUser);
};