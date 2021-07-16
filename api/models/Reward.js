const Sequelize = require('sequelize');

const { Model } = require('sequelize');

class Reward extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      isActive: DataTypes.BOOLEAN,
      message: DataTypes.STRING,
      points: DataTypes.INTEGER,
      title: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.Reward.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'accountId'
    });
  }

  static async resetActiveForAccount(accountId) {
    const rewards = await Reward.findAll({
      where: {
        accountId
      }
    });

    const ids = rewards.map(reward => reward.id);

    return Reward.update({ isActive: false }, { where: { id: ids } });
  }

  static async canAccess({ req }) {
    const { accounts } = req.user;
    const { rewardId } = req.params;

    const reward = await this.findByPk(rewardId)

    const canAccess = accounts.some(account => account.accountId === reward.accountId)

    return canAccess
  }

  static async getRandomReward() {
    const reward = await this.findOne({
      where: {
        isActive: true
      },
      order: [
        [Sequelize.fn('RAND')]
      ]
    })

    return reward
  }

  static async getRewardForLocationGuess({ guessLocationId, postLocationId }) {
    const { Account, Reward } = this.sequelize.models;

    let account = null

    let reward = null

    let rewardResponse = null

    account = await Account.findOne({
      where: {
        locationId: postLocationId
      }
    })

    if (!account && guessLocationId) {
      account = await Account.findOne({
        where: {
          locationId: guessLocationId
        }
      })
    }

    if (!account) {
      reward = await Reward.getRandomReward()
    } else {
      reward = await this.findOne({
        where: {
          isActive: true,
          accountId: account.id
        }
      })
    }

    if (!reward) {
      reward = await Reward.getRandomReward()
    }

    if (reward) {
      const rewardAccount = await Account.findOne({
        where: {
          id: reward.accountId
        },
        include: [{ all: true, nested: true }]
      })

      rewardResponse = {
        reward: reward.toJSON(),
        account: rewardAccount.toJSON()
      }
    }

    return rewardResponse
  }

  async getResponse() {
    const { RewardRedemption } = this.sequelize.models;

    const redemptionCount = await RewardRedemption.count({
      where: {
        rewardId: this.id
      }
    })

    return {
      ...this.toJSON(),
      redemptionCount
    }
  }
}

module.exports = {
  Reward
}
