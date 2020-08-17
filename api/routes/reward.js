const { deleteReward, getAccountRewards, postReward, putReward } = require('../controllers/rewardController');
const { validateDeleteReward, validateGetAccountRewards, validatePostReward, validatePutReward } = require('../validations/reward');

module.exports = async (fastify) => {
  fastify.delete('/reward/:rewardId', validateDeleteReward, deleteReward)
  fastify.get('/account/:accountId/rewards', validateGetAccountRewards, getAccountRewards)
  fastify.post('/reward', validatePostReward, postReward);
  fastify.put('/reward/:rewardId', validatePutReward, putReward);
};
