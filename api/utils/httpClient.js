const fetch = require('node-fetch')

const getRequest = ({ url, options }) => fetch(url, { ...options, timeout: process.env.EXTERNAL_API_TIMEOUT, json: true });

module.exports = {
  getRequest
}
