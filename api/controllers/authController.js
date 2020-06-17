const { User } = require('../models/User');
const { UserResponse } = require('../models/User');
const { USER_DOESNT_EXIST } = require('../models/Errors');

const postLogin = async (req, res) => {
  const { email: reqEmail } = req.body;
  try {
    const user = await User.findOne({ email: reqEmail.toLowerCase() }).exec();

    if (!user) {
      res.send(new Error(USER_DOESNT_EXIST));
      return;
    }

    const { accounts, avatar, createdAt, email, id, pushToken, role, username } = user;

    return res.send(new UserResponse({ accounts, avatar, createdAt, email, id, pushToken, role, username }));
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postLogin,
};