const {
  validateGetCheckUsername,
  validateGetUser,
  validateGetUserAccounts,
  validateGetUserEmail,
  validatePostUser,
  validatePostUserFollow,
  validatePutUser
} = require('../validations/user');
const {
  getCheckUsername,
  getUser,
  getUserAccounts,
  getUserEmail,
  postUser,
  postUserFollow,
  putUser
} = require('../controllers/userController');

module.exports = async (fastify) => {
  fastify.get('/user/email/:email', validateGetUserEmail, getUserEmail);
  fastify.get('/user/:id', validateGetUser, getUser);
  fastify.get('/user/:id/accounts', validateGetUserAccounts, getUserAccounts);
  fastify.get('/user/checkusername/:username', validateGetCheckUsername, getCheckUsername);
  fastify.post('/user', validatePostUser, postUser);
  fastify.post('/user/:followingId/follow', validatePostUserFollow, postUserFollow);
  fastify.put('/user/:userId', validatePutUser, putUser);
};
