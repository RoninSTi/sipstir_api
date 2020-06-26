const { postReward } = require('../controllers/rewardController');
const { validateGetAccountRewards, validatePostReward } = require('../validations/reward')

module.exports = async (fastify) => {
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards)
  fastify.post('/offer', validatePostReward, postReward);
};
