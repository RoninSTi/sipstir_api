const nconf = require('nconf');
const jwtDecode = require('jwt-decode')

const { getMe, getUser } = require('../adaptors/facebookAdaptor')

async function getAuthSwoopCallback(req, res) {
  try {
    const { id_token } = await this.swoop.getAccessTokenFromAuthorizationCodeFlow(req)

    const { email } = jwtDecode(id_token);

    const accessToken = this.jwt.sign({ email }, {
      expiresIn: 864000
    });

    res.send({ accessToken })
  } catch (error) {
    res.send(error)
  }
}

async function postAuthFacebook(req, res) {
  const { fbToken } = req.body

  try {
    const meResponse = await getMe(fbToken);

    const meData = await meResponse.json();

    const { id } = meData

    const userResponse = await getUser({ id, token: fbToken })

    const userData = await userResponse.json();

    const accessToken = this.jwt.sign(userData, {
      expiresIn: 864000
    });

    res.send({ accessToken })
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  getAuthSwoopCallback,
  postAuthFacebook
}
