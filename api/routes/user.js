const { validateGetCheckUsername, validateGetUser, validateGetUserEmail, validatePostUser, validatePutUser } = require('../validations/user');
const { getCheckUsername, getUser, getUserEmail, postUser, putUser } = require('../controllers/userController');

module.exports = async (fastify) => {
  fastify.get('/user/email/:email', validateGetUserEmail, getUserEmail);
  fastify.get('/user/:id', validateGetUser, getUser);
  fastify.get('/user/checkusername/:username', validateGetCheckUsername, getCheckUsername);
  fastify.post('/user', validatePostUser, postUser);
  fastify.put('/user/:userId', validatePutUser, putUser);
};
