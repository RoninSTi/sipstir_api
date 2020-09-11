const { deleteSubscription, postSubscription } = require('../controllers/subscriptionController');
const { validateDeleteSubscription, validatePostSubscription } = require('../validations/subscription');

module.exports = async (fastify) => {
  fastify.delete('/subscription/:subscriptionId', validateDeleteSubscription, deleteSubscription)
  fastify.post('/subscription', validatePostSubscription, postSubscription);
};
