const { AccountUser } = require('../models/AccountUser');

const postAccountUser = async (req, res) => {
  const { email } = req.body;
  try {
    const accountUser = await AccountUser.create({
      email
    })

    res.send(accountUser.toJSON());
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  postAccountUser
};
