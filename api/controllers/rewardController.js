const { Account, Reward } = require('../db/db');

const getAccountRewards = async (req, res) => {
  const { accountId } = req.params;

  try {
    const rewards = await Reward.findAll({
      where: {
        accountId,
      }
    });

    const response = rewards.map(reward => reward.toJSON());

    res.send(response)
  } catch (error) {
    res.send(error);
  }
}

const postReward = async (req, res) => {
  const { accountId, ...rewardData } = req.body

  try {
    const account = await Account.findByPk(accountId)

    if (rewardData.isActive) {
      await Reward.resetActiveForAccount(accountId);
    }

    const reward = await Reward.create({ ...rewardData });

    await reward.setAccount(account);

    res.send(reward.toJSON());
  } catch (error) {
    res.send(error)
  }
}

const putReward = async (req, res) => {
  const { ...rewardData } = req.body;
  const { rewardId } = req.params

  try {
    const reward = await Reward.findByPk(rewardId);

    if (rewardData.isActive) {
      await Reward.resetActiveForAccount(rewardData.accountId);
    }

    Object.keys(rewardData).forEach(key => {
      reward[key] = rewardData[key]
    });

    await reward.save()

    res.send(reward.toJSON())
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  getAccountRewards,
  postReward,
  putReward
};
