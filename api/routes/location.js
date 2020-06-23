const { validatePostLocationId } = require('../validations/location');
const { postLocationId } = require('../controllers/locationController');

module.exports = async (fastify) => {
  fastify.post('/location/:placeId', validatePostLocationId, postLocationId);
};
