const { validatePostLogin } = require('../validations/auth');
const { postLogin } = require('../controllers/authController');

module.exports = async (fastify) => {
  fastify.post('/auth/login', validatePostLogin, postLogin);
};