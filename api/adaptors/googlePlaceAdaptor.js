const nconf = require('nconf');
const joinUrl = require('url-join');

const { getRequest } = require('../utils/httpClient');

const getPlaceDetails = (id) => {
  const googlePlaceApiUrl = process.env.GOOGLE_PLACE_URI;

  const key = process.env.GOOGLE_PLACE_API_KEY;

  return getRequest({
    url: joinUrl(googlePlaceApiUrl, `details/json?place_id=${id}&fields=formatted_phone_number,name,photos,vicinity,website,geometry/location&key=${key}`),
  })
}

module.exports = {
  getPlaceDetails
}
