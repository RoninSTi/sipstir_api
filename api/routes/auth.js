const { validatePostAuthFacebook } = require('../validations/auth');
const { getAuthSwoopCallback, postAuthFacebook } = require('../controllers/authController');

module.exports = async (fastify) => {
  fastify.get('/auth/swoop/callback', getAuthSwoopCallback);
  fastify.post('/auth/facebook', validatePostAuthFacebook, postAuthFacebook);
};
