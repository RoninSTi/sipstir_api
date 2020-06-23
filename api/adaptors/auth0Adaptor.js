const nconf = require('nconf');
const joinUrl = require('url-join');

const { getRequest } = require('../utils/httpClient');

const auth0ApiUrl = nconf.get('url.auth0Api');
const token = nconf.get('keys.auth0.managementApiToken');
const BEARER_TOKEN = `Bearer ${token}`;

const getPermissions = ({ id }) => getRequest({
  url: joinUrl(auth0ApiUrl, `users/${id}/permissions`),
  options: {
    headers: {
      Authorization: BEARER_TOKEN
    }
  }
})

module.exports = {
  getPermissions
}
