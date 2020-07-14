const { validateGetActivity } = require('../validations/activity');
const { getActivity } = require('../controllers/activityController');

module.exports = async (fastify) => {
  fastify.get('/activity/:userId', validateGetActivity, getActivity);
};
