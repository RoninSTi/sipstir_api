const { validateGetPost, validateGetPostCheers, validatePostCheers, validatePostGuess, validatePostPost } = require('../validations/post');
const { getPost, getPostCheers, postCheers, postGuess, postPost } = require('../controllers/postController');

module.exports = async (fastify) => {
  fastify.get('/post/:postId', validateGetPost, getPost);
  fastify.get('/post/:postId/cheers', validateGetPostCheers, getPostCheers);
  fastify.post('/post', validatePostPost, postPost);
  fastify.post('/post/:postId/guess', validatePostGuess, postGuess);
  fastify.post('/post/:postId/cheers', validatePostCheers, postCheers);
};
