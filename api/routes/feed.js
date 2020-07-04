const { validateGetFeed } = require('../validations/feed');
const { getFeed } = require('../controllers/feedController');

module.exports = async (fastify) => {
  fastify.get('/feed/:feedType/user/:userId', validateGetFeed, getFeed);
};
