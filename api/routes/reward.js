const { deleteReward, getAccountRewards, getRewards, getRedemptions, postReward, postRewardRedeem, putReward } = require('../controllers/rewardController');
const { validateDeleteReward, validateGetAccountRewards, validateGetRedemptions, validateGetRewards, validatePostReward, validatePostRewardRedeem, validatePutReward } = require('../validations/reward');

module.exports = async (fastify) => {
  fastify.delete('/reward/:rewardId', validateDeleteReward, deleteReward);
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards);
  fastify.get('/rewards', validateGetRewards, getRewards)
  fastify.get('/reward/redemptions/:userId', validateGetRedemptions, getRedemptions);
  fastify.post('/reward', validatePostReward, postReward);
  fastify.post('/reward/:rewardId/redeem', validatePostRewardRedeem, postRewardRedeem);
  fastify.put('/reward/:rewardId', validatePutReward, putReward);
};
