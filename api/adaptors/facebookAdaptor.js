const { getRequest } = require('../utils/httpClient');

const getMe = token => {
  return getRequest({ url: `https://graph.facebook.com/me?access_token=${token}` })
}

const getUser = ({ id, token }) => {
  return getRequest({ url: `https://graph.facebook.com/${id}?fields=email,picture.type(large)&access_token=${token}` })
}

module.exports = {
  getMe,
  getUser
}
