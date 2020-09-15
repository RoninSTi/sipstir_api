const { Account, Location, Reward } = require('../db/db');

async function getLocationDetails(req, res) {
  const { locationId } = req.params

  try {
    const account = await Account.findOne({
      where: {
        locationId,
      }
    })

    let response = null

    if (account) {
      const reward = await Reward.findOne({
        include: [{ all: true, nested: true }],
        where: {
          accountId: account.id,
          isActive: true
        }
      })

      if (reward) {
        response = {
          reward: reward.toJSON()
        }
      }
    }

    if (!response) {
      location = await Location.findByPk(locationId)

      response = {
        location: location.toJSON()
      }
    }

    res.send(response)
  } catch (error) {
    res.send(error)
  }
}

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
  getLocationDetails,
  postLocationId
};
