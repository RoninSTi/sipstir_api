const Sequelize = require('sequelize');
const { Account, Location, Reward, RewardRedemption, User, sequelize } = require('../db/db');
const Op = Sequelize.Op;

const deleteReward = async (req, res) => {
  const { rewardId } = req.params;

  try {
    await Reward.destroy({
      where: {
        id: rewardId
      }
    });

    res.send(200);
  } catch (error) {
    res.send(error)
  }
}

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

async function getRewards(req, res) {
  const { lat, lng, page = 1, pageSize = 100, radius = 40000, search } = req.query;

  const offset = (page * pageSize) - pageSize;
  const limit = pageSize;

  try {
    if (search) {
      const accounts = await Account.findAll({
        where: {
          name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search + '%')
        }
      })

      const accountIds = accounts.map(account => account.id)

      const rewards = await Reward.findAll({
        include: [{ all: true, nested: true }],
        order: [
          [{ model: Account, as: 'account' }, 'name', 'ASC'],
        ],
        where: {
          accountId: [accountIds],
        }
      })

      if (!rewards) {
        res.send([])
      }

      const response = rewards.map(reward => reward.toJSON())

      res.send(response)
    } else if (lat && lng) {
      const attributes = ['id'];

      var location = sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);

      var distance = sequelize.fn('ST_Distance_Sphere', sequelize.literal('geometry'), location);

      attributes.push([distance, 'distance']);

      const inRadius = await Location.findAll({
        attributes,
        where: sequelize.where(distance, { [Op.lte]: radius }),
      })

      const locationIds = inRadius.map(location => location.id)

      const accounts = await Account.findAll({
        where: {
          locationId: [locationIds]
        }
      })

      if (!accounts) {
        res.send([])
      }

      const accountIds = accounts.map(account => account.id)

      const rewards = await Reward.findAll({
        include: [{ all: true, nested: true }],
        limit,
        offset,
        where: {
          accountId: [accountIds],
          isActive: true,
        }
      })

      if (!rewards) {
        res.send([])
      }

      const response = rewards.map(reward => reward.toJSON())

      res.send(response)
    } else {
      const rewards = await Reward.findAll({
        include: [{ all: true, nested: true }],
        limit,
        offset,
        order: [
          [{ model: Account, as: 'account' }, 'name', 'ASC'],
        ],
        where: {
          isActive: true,
        }
      })

      if (!rewards) {
        res.send([])
      }

      const response = rewards.map(reward => reward.toJSON())

      res.send(response)
    }
  } catch (error) {
    res.send(error)
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

async function postRewardRedeem(req, res) {
  const { rewardId } = req.params

  const { id: userId } = req.user

  try {
    const reward = await Reward.findByPk(rewardId)

    const user = await User.findByPk(userId)

    const rewardRedemption = await RewardRedemption.create();

    await rewardRedemption.setUser(user)

    await rewardRedemption.setReward(reward)

    await user.redeemReward({ reward })

    const response = await User.getSingle({ client: this.client, id: user.id, redis: this.redis });

    res.send(response)
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
      await Reward.resetActiveForAccount(reward.accountId);
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
  deleteReward,
  getAccountRewards,
  getRewards,
  postReward,
  postRewardRedeem,
  putReward
};
