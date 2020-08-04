const { getPing } = require('../controllers/pingController');

module.exports = async (fastify) => {
  fastify.get('/ping', getPing);
};
