const jwtDecode = require('jwt-decode')
const { User } = require('../db/db');

const { getMe, getUser } = require('../adaptors/facebookAdaptor')

async function getAuthSwoopCallback(req, res) {
  try {
    const { id_token } = await this.swoop.getAccessTokenFromAuthorizationCodeFlow(req)

    const { email } = jwtDecode(id_token);

    const user = await User.findOrCreateByEmail({ client: this.client, email, redis: this.redis })

    const { roles } = user

    const accessToken = this.jwt.sign({ email, roles }, {
      expiresIn: 864000
    });

    const userResponse = await User.getSingle({ client: this.client, id: user.id, redis: this.redis });

    res.send({ accessToken, user: userResponse })
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

    const fbUserResponse = await getUser({ id, token: fbToken })

    const userData = await fbUserResponse.json();

    const { email, picture } = userData;

    const user = await User.findOrCreateByEmail({ client: this.client, email, redis: this.redis, avatar: picture.data.url })

    const { roles } = user

    const accessToken = this.jwt.sign({ email, roles }, {
      expiresIn: 864000
    });

    const userResponse = await User.getSingle({ client: this.client, id: user.id, redis: this.redis });

    res.send({ accessToken, user: userResponse })
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  getAuthSwoopCallback,
  postAuthFacebook
}
