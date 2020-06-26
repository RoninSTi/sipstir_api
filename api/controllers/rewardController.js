const { Account } = require('../models/Account');
const { Reward } = require('../models/Reward');

const getAccountRewards = async (req, res) => {
  const { accountId } = req.params;

  try {
    const rewards = await Reward.findAll({
      where: {
        accountId,
      }
    });

    res.send(rewards.toJSON())
  } catch (error) {
    res.send(error);
  }
}

const postReward = async (req, res) => {
  const { accountId, ...rewardData } = req.body

  try {
    const account = await Account.findByPk(accountId)

    const reward = await Reward.create({ ...offerData });

    await reward.setAccount(account);

    res.send(reward.toJSON());
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  getAccountRewards,
  postReward
};
