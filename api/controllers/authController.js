const nconf = require('nconf');

const { getMe, getUser } = require('../adaptors/facebookAdaptor')

async function postAuthFacebook(req, res) {
  const { fbToken } = req.body

  try {
    const meResponse = await getMe(fbToken);

    const meData = await meResponse.json();

    const { id } = meData

    const userResponse = await getUser({ id, token: fbToken })

    const userData = await userResponse.json();

    console.log({ userData })

    const accessToken = this.jwt.sign(userData, {
      expiresIn: 864000
    });

    res.send({ accessToken })
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  postAuthFacebook
}
