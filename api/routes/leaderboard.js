const { getLeaderboard } = require('../controllers/leaderboardController');

module.exports = async (fastify) => {
  fastify.get('/leaderboard', getLeaderboard);
};
