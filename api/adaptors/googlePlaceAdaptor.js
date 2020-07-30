const nconf = require('nconf');
const joinUrl = require('url-join');

const { getRequest } = require('../utils/httpClient');

const getPlaceDetails = (id) => {
  const googlePlaceApiUrl = nconf.get('url.googlePlaceApi');

  const key = nconf.get('keys.google.googlePlaceApiKey');

  return getRequest({
    url: joinUrl(googlePlaceApiUrl, `details/json?place_id=${id}&fields=name,photos,vicinity,geometry/location&key=${key}`),
  })
}

module.exports = {
  getPlaceDetails
}
