const { postPaymentMethod } = require('../controllers/paymentMethodController');
const { validatePostPaymentMethod } = require('../validations/paymentMethod');

module.exports = async (fastify) => {
  fastify.post('/paymentmethod', validatePostPaymentMethod, postPaymentMethod);
};
