const { validatePostSignedUrl } = require('../validations/upload');
const { postSignedUrl, postSignedImageUrl } = require('../controllers/uploadController');

module.exports = async (fastify) => {
  fastify.post('/upload/signedurl/file', validatePostSignedUrl, postSignedUrl);
  fastify.post('/upload/signedurl/image', validatePostSignedUrl, postSignedImageUrl);
};
