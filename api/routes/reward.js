const { getAccountRewards, postReward, putReward } = require('../controllers/rewardController');
const { validateGetAccountRewards, validatePostReward, validatePutReward } = require('../validations/reward')

module.exports = async (fastify) => {
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards)
  fastify.post('/reward', validatePostReward, postReward);
  fastify.put('/reward/:rewardId', validatePutReward, putReward);
};
