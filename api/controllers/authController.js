const jwtDecode = require('jwt-decode')
const { User } = require('../db/db');

const { getMe, getUser } = require('../adaptors/facebookAdaptor')

async function getAuthSwoopCallback(req, res) {
  try {
    const { id_token } = await this.swoop.getAccessTokenFromAuthorizationCodeFlow(req)

    const { email } = jwtDecode(id_token);

    const user = await User.findOrCreateByEmail({ client: this.client, email, redis: this.redis })

    const accounts = await user.getAccounts({ include: [{ all: true, nested: true }] });

    const accountTokenData = accounts.map(account => ({ accountId: account.id, role: account.AccountUser.role}))

    const { id, roles } = user

    const accessToken = this.jwt.sign({ email, id, roles, accounts: accountTokenData });

    const userResponse = await User.getSingle({ client: this.client, id, redis: this.redis });

    res.send({ accessToken, user: userResponse })
  } catch (error) {
    res.send(error)
  }
}

async function postAuthApple(req, res) {
  const { identityToken } = req.body

  try {
    const userData = jwtDecode(identityToken)

    const { email } = userData;

    const user = await User.findOrCreateByEmail({ client: this.client, email, redis: this.redis })

    const { id: userId, roles } = user

    const accessToken = this.jwt.sign({ email, id: userId, roles });

    const userResponse = await User.getSingle({ client: this.client, id: userId, redis: this.redis });

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

    const { id: userId, roles } = user

    const accessToken = this.jwt.sign({ email, id: userId, roles });

    const userResponse = await User.getSingle({ client: this.client, id: userId, redis: this.redis });

    res.send({ accessToken, user: userResponse })
  } catch (error) {
    res.send(error)
  }
}

async function postLogin(req, res) {
  const { email } = req.body

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });

    const { id, roles } = user;

    const accessToken = this.jwt.sign({ email, id, roles });

    const userResponse = await User.getSingle({ client: this.client, id, redis: this.redis });

    res.send({ accessToken, user: userResponse })
  } catch (error) {
    res.send(error)
  }
}

async function postRegister(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOrCreateByEmail({ client: this.client, email, redis: this.redis, password })

    const { id, roles } = user

    const accessToken = this.jwt.sign({ email, id, roles });

    const userResponse = await User.getSingle({ client: this.client, id, redis: this.redis });

    res.send({ accessToken, user: userResponse })
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  getAuthSwoopCallback,
  postAuthApple,
  postAuthFacebook,
  postLogin,
  postRegister
}
