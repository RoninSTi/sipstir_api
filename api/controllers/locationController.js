const { Location } = require('../db/db');

const postLocationId = async (req, res) => {
  const { placeId } = req.params;

  try {
    location = await Location.createLocationFromPlaceId(placeId);

    res.send(location.toJSON());
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  postLocationId
};
