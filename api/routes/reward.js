const { deleteReward, getAccountRewards, getRewards, postReward, postRewardRedeem, putReward } = require('../controllers/rewardController');
const { validateDeleteReward, validateGetAccountRewards, validateGetRewards, validatePostReward, validatePostRewardRedeem, validatePutReward } = require('../validations/reward');

module.exports = async (fastify) => {
  fastify.delete('/reward/:rewardId', validateDeleteReward, deleteReward);
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards);
  fastify.get('/rewards', validateGetRewards, getRewards)
  fastify.post('/reward', validatePostReward, postReward);
  fastify.post('/reward/:rewardId/redeem', validatePostRewardRedeem, postRewardRedeem);
  fastify.put('/reward/:rewardId', validatePutReward, putReward);
};
