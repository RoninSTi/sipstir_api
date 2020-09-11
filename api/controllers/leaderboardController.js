const { User } = require('../db/db');

async function getLeaderboard(_, res) {
  try {
    const top100 = await this.redis.zrevrange('leaderboard', 0, 99, "WITHSCORES");

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

    const response = ids.map((id, index)=> {
      const user = users.find(user => user.id === parseInt(id));

      if (user.points === 0) return null

      return {
        ...user.toJSON(),
        allTimeLeaderboardPosition: index + 1
      };
    }).filter(el => el !== null);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getLeaderboard
};
