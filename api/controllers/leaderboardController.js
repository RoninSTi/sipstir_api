const { User } = require('../db/db');

async function getLeaderboard(_, res) {
  try {
    const top100 = await this.redis.zrevrange('leaderboard', 0, 99, "WITHSCORES");

    console.log({ top100 })

    const ids = top100
      .map((result, index) => {
        if (index % 2 === 0) {
          return result
        }
      })
      .filter(el => el !== undefined)

    const users = await User.findAll(
      {
        where: {
          id: ids
        }
      }
    );

    console.log({ ids })

    const response = ids.map((id, index)=> {
      const user = users.find(user => user.id === parseInt(id));

      return {
        ...user.toJSON(),
        allTimeLeaderboardPosition: index + 1
      };
    });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getLeaderboard
};
