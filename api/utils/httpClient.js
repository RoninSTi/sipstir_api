const fetch = require('node-fetch')
const nconf = require('nconf');

const externalAPITimeout = nconf.get('app.externalAPITimeout');

const getRequest = ({ url, options }) => fetch(url, { ...options, timeout: externalAPITimeout, json: true });

module.exports = {
  getRequest
}
