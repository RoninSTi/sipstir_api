const { validatePostAuthFacebook } = require('../validations/auth');
const { postAuthFacebook } = require('../controllers/authController');

module.exports = async (fastify) => {
  fastify.post('/auth/facebook', validatePostAuthFacebook, postAuthFacebook);
};
