const Sequelize = require("sequelize");
const {
  Account,
  Location,
  Reward,
  RewardRedemption,
  User,
  sequelize,
} = require("../db/db");

async function getVerify(req, res) {
  const { otp } = req.query;

  try {
    const user = await User.findOne({
      where: {
        otp,
      },
    });

    const response = {
      setPassword: Boolean(user.password),
    };

    res.send(response);
  } catch (err) {
    res.send(err);
  }
}

module.exports = {
  getVerify,
};
