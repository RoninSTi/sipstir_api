const { validateGetAccountActivity, validateGetActivity } = require('../validations/activity');
const { getAccountActivity, getActivity } = require('../controllers/activityController');

module.exports = async (fastify) => {
  fastify.get('/activity/:userId', validateGetActivity, getActivity);
  fastify.get('/activity/account/:accountId', validateGetAccountActivity, getAccountActivity)
};
