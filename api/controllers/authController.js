const jwtDecode = require("jwt-decode");
const { User } = require("../db/db");
const nconf = require("nconf");

const { getMe, getUser } = require("../adaptors/facebookAdaptor");

async function postAuthApple(req, res) {
  const { identityToken } = req.body;

  try {
    const userData = jwtDecode(identityToken);

    const { email } = userData;

    const user = await User.findOrCreateByEmail({
      client: this.client,
      email,
      redis: this.redis,
    });

    const { avatar, id: userId, roles, username } = user;

    const accessToken = this.jwt.sign({ avatar, email, id: userId, roles, username });

    res.send({ accessToken });
  } catch (error) {
    res.send(error);
  }
}

async function postAuthFacebook(req, res) {
  const { fbToken } = req.body;

  try {
    const meResponse = await getMe(fbToken);

    const meData = await meResponse.json();

    const { id } = meData;

    const fbUserResponse = await getUser({ id, token: fbToken });

    const userData = await fbUserResponse.json();

    const { email, picture } = userData;

    const user = await User.findOrCreateByEmail({
      client: this.client,
      email,
      redis: this.redis,
      avatar: picture.data.url,
    });

    const { avatar, id: userId, roles, username } = user;

    const accessToken = this.jwt.sign({ avatar, email, id: userId, roles, username });

    res.send({ accessToken });
  } catch (error) {
    res.send(error);
  }
}

async function postForgot(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    await user.setOtp();

    const data = {
      from: "Sipstir Business <no-reply@sipstir.app>",
      to: email,
      subject: "Reset Password for Sipstir Business",
      text: `Reset your password by following this link: ${process.env.AUTH_CALLBACK_HOST}/reset?otp=${user.otp}`,
    };

    await this.mg.messages().send(data);

    res.code(200).send();
  } catch (error) {
    res.send(error);
  }
}

async function postLogin(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    const accounts = await user.getAccounts({
      include: [{ all: true, nested: true }],
    });

    const { id, roles, username, avatar } = user;

    const accessToken = this.jwt.sign(
      { accounts, avatar, email, id, roles, username },
      // {
      //   expiresIn: nconf.get("cookies.accessExpiration"),
      // }
    );

    const refreshToken = this.jwt.sign(
      {
        id,
      },
      // {
      //   expiresIn: nconf.get("cookies.refreshExpiration"),
      // }
    );

    res
      .setCookie("access_token", accessToken, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .setCookie("refresh_token", refreshToken, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .setCookie("logged_in", true, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: false,
        sameSite: true,
      })
      .code(200)
      .send({
        accessToken,
      });
  } catch (error) {
    res.send(error);
  }
}

async function postLogout(req, res) {
  res
    .setCookie("access_token", "", {
      // domain: nconf.get("cookies.host"),
      path: "/",
      // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
      maxAge: -1,
    })
    .setCookie("refresh_token", "", {
      // domain: nconf.get("cookies.host"),
      path: "/",
      // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
      maxAge: -1,
    })
    .setCookie("logged_in", "", {
      // domain: nconf.get("cookies.host"),
      path: "/",
      // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
      httpOnly: false,
      sameSite: true,
      maxAge: -1,
    })
    .code(200);
}

async function postPasswordReset(req, res) {
  const { otp, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        otp,
      },
    });

    if (!user) {
      throw new Error("No user associated");
    }

    await user.update({
      password,
    });

    const userResponse = await User.getSingle({
      client: this.client,
      id: user.id,
      redis: this.redis,
    });

    res.send({
      user: userResponse,
    });
  } catch (err) {
    res.send(err);
  }
}

async function postRefresh(req, res) {
  const { access_token, refresh_token } = req.cookies;

  const { id: refresh_id } = this.jwt.decode(refresh_token);

  const { id: access_id } = this.jwt.decode(access_token);

  try {
    if (access_id !== refresh_id) {
      throw new Error("token id mismatch");
    }

    const user = await User.findByPk(access_id);

    const accounts = await user.getAccounts({
      include: [{ all: true, nested: true }],
    });

    const { email, id, roles } = user;

    const accessToken = this.jwt.sign(
      { accounts, email, id, roles },
      {
        // expiresIn: nconf.get("cookies.accessExpiration"),
      }
    );

    const refreshToken = this.jwt.sign(
      {
        id,
      },
      {
        // expiresIn: nconf.get("cookies.refreshExpiration"),
      }
    );

    res
      .setCookie("access_token", accessToken, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .setCookie("refresh_token", refreshToken, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .setCookie("logged_in", true, {
        // domain: nconf.get("cookies.host"),
        path: "/",
        // secure: nconf.get("cookies.secure"), // send cookie over HTTPS only
        httpOnly: false,
        sameSite: true,
      })
      .code(200)
      .send({
        accessToken,
      });
  } catch (err) {
    res.send(err);
  }
}

async function postRegister(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOrCreateByEmail({
      client: this.client,
      email,
      redis: this.redis,
      password,
    });

    const { id, roles } = user;

    const accessToken = this.jwt.sign({ email, id, roles });

    const userResponse = await User.getSingle({
      client: this.client,
      id,
      redis: this.redis,
    });

    res.send({ accessToken, user: userResponse });
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  postAuthApple,
  postAuthFacebook,
  postForgot,
  postLogin,
  postLogout,
  postPasswordReset,
  postRefresh,
  postRegister,
};
