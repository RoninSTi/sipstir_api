const { validatePostAuthFacebook, validatePostLogin, validatePostRegister } = require('../validations/auth');
const { getAuthSwoopCallback, postAuthFacebook, postLogin, postRegister } = require('../controllers/authController');

module.exports = async (fastify) => {
  fastify.get('/auth/swoop/callback', getAuthSwoopCallback);
  fastify.post('/auth/facebook', validatePostAuthFacebook, postAuthFacebook);
  fastify.post('/auth/login', validatePostLogin, postLogin);
  fastify.post('/auth/register', validatePostRegister, postRegister);
};
