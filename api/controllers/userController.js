const { Account, User } = require('../db/db');

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

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    res.send(user.toJSON());
  } catch (error) {
    res.send(error)
  }
}

const getUserEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });

    res.send(user ? user.toJSON() : null)
  } catch (error) {
    res.send(error)
  }
}

const postUser = async (req, res) => {
  const { accountId, ...userData } = req.body;

  try {
    const user = await User.create({ ...userData });

    if (accountId) {
      const account = await Account.findByPk(accountId);

      await account.setUser(user);
    }

    res.send(user.toJSON());
  } catch (error) {
    res.send(error);
  }
};

const putUser = async (req, res) => {
  const { ...userData } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    Object.keys(userData).forEach(key => {
      user[key] = userData[key]
    });

    await user.save()

    res.send(user.toJSON())
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getCheckUsername,
  getUser,
  getUserEmail,
  postUser,
  putUser
};
