const { Model } = require('sequelize');
const { getPlaceDetails } = require('../adaptors/googlePlaceAdaptor');

class Location extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
      photo: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue('photo'));
        },
        set: function (value) {
          this.setDataValue('photo', JSON.stringify(value));
        }
      },
      geometry: DataTypes.GEOMETRY('POINT'),
      placeId: DataTypes.STRING,
      vicinity: DataTypes.STRING
    }, {
      sequelize,
      timestamps: true
    })
  }

  static async createLocationFromPlaceId(placeId) {
    const location = await this.findOne({
      where: {
        placeId,
      }
    })

    if (location) return location;

    try {
      const response = await getPlaceDetails(placeId);
      const responseJSON = await response.json();

      const { result: googlePlace } = responseJSON;

      const { html_attributions, ...photoData } = googlePlace.photos[0];

      const { lat, lng } = googlePlace.geometry.location

      const geometry = { type: 'Point', coordinates: [lng, lat]}

      const locationData = {
        name: googlePlace.name,
        geometry,
        photo: photoData,
        placeId,
        vicinity: googlePlace.vicinity
      };

      const location = await this.create(locationData);

      return location;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  Location
}

