const { postSubscription } = require('../controllers/subscriptionController');
const { validatePostSubscription } = require('../validations/subscription')

module.exports = async (fastify) => {
  fastify.post('/subscription', validatePostSubscription, postSubscription);
};
