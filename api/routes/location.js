const { validateGetLocationDetails, validatePostLocationId } = require('../validations/location');
const { getLocationDetails, postLocationId } = require('../controllers/locationController');

module.exports = async (fastify) => {
  fastify.post('/location/:placeId', validatePostLocationId, postLocationId);
  fastify.get('/location/:locationId/details', validateGetLocationDetails, getLocationDetails)
};
