const { validateGetBlockedUsers, validatePostBlockUser } = require('../validations/block');
const { getBlockedUsers, postBlockUser } = require('../controllers/blockController');

module.exports = async (fastify) => {
  fastify.get('/block', validateGetBlockedUsers, getBlockedUsers);
  fastify.post('/block/:blockedId', validatePostBlockUser, postBlockUser);
};
