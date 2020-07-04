const { validatePostGuessComment } = require('../validations/guess');
const { postGuessComment } = require('../controllers/guessController');

module.exports = async (fastify) => {
  fastify.post('/guess/:guessId/comment', validatePostGuessComment, postGuessComment);
};
