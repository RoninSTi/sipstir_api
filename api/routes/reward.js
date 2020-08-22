const { deleteReward, getAccountRewards, getRewards, postReward, putReward } = require('../controllers/rewardController');
const { validateDeleteReward, validateGetAccountRewards, validateGetRewards, validatePostReward, validatePutReward } = require('../validations/reward');

module.exports = async (fastify) => {
  fastify.delete('/reward/:rewardId', validateDeleteReward, deleteReward)
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards)
  fastify.get('/rewards', validateGetRewards, getRewards)
  fastify.post('/reward', validatePostReward, postReward);
  fastify.put('/reward/:rewardId', validatePutReward, putReward);
};
