const { validateGetPost, validatePostCheers, validatePostGuess, validatePostPost } = require('../validations/post');
const { getPost, postCheers, postGuess, postPost } = require('../controllers/postController');

module.exports = async (fastify) => {
  fastify.get('/post/:postId', validateGetPost, getPost);
  fastify.post('/post', validatePostPost, postPost);
  fastify.post('/post/:postId/guess', validatePostGuess, postGuess);
  fastify.post('/post/:postId/cheers', validatePostCheers, postCheers);
};
