const { Account } = require('../models/Account');
const { User } = require('../models/User');

const getCheckUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({
      where: {
        username
      }
    })

    const usernameTaken = !!existingUser

    res.send({ isAvailable: !usernameTaken })
  } catch (error) {
    res.send(error)
  }
}

const postUser = async (req, res) => {
  const { accountId, ...userData } = req.body;

  try {
    const user = await User.create({ ...userData })

    if (accountId) {
      const account = await Account.findByPk(accountId)

      await account.setUser(user)
    }

    res.send(user.toJSON());
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getCheckUsername,
  postUser
};
