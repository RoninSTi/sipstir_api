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

async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.send(null);

      return;
    }

    // await this.client.user(`${user.id}`).getOrCreate();

    const response = await User.getSingle({ client: this.client, id, redis: this.redis });

    res.send(response);
  } catch (error) {
    res.send(error)
  }
}

async function getUserEmail(req, res) {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.send(null);

      return;
    }

    // await this.client.user(`${user.id}`).getOrCreate();

    const response = await User.getSingle({ client: this.client, id: user.id, redis: this.redis });

    res.send(response);
  } catch (error) {
    res.send(error)
  }
}

async function postUser(req, res) {
  const { accountId, ...userData } = req.body;

  try {
    const user = await User.create({ ...userData });

    await user.addPoints({ amount: 0, redis: this.redis });

    if (accountId) {
      const account = await Account.findByPk(accountId);

      await account.setUser(user);
    }

    await this.client.user(`${user.id}`).getOrCreate();

    const response = await User.getSingle({ client: this.client, id: user.id, redis: this.redis });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

async function postUserFollow(req, res) {
  const { followingId } = req.params;
  const { userId } = req.body;

  try {
    const timelineFeed = await this.client.feed('timeline', `${userId}`);

    followingResponse = await timelineFeed.following({ offset: 0, limit: 1, filter: [`user:${followingId}`] });

    const isFollowing = followingResponse.results.length > 0;

    const followingUser = await User.findByPk(followingId)

    if (isFollowing) {
      await timelineFeed.unfollow('user', `${followingId}`);

      const unfollowActivity = {
        actor: `${userId}`,
        verb: 'unfollow',
        object: `user:${followingId}`,
        time: new Date(),
        message: `You unfollowed ${followingUser.username}`
      }

      const creatorNotificationFeed = this.client.feed('notification', `${userId}`);

      await creatorNotificationFeed.addActivity(unfollowActivity);
    } else {
      const user = await User.findByPk(userId)

      await timelineFeed.follow('user', `${followingId}`);

      const followActivity = {
        actor: `${userId}`,
        verb: 'follow',
        object: `user:${followingId}`,
        time: new Date(),
      }

      const objectMessage = `${user.username} followed you`

      const objectFollowActivity = {
        ...followActivity,
        foreign_id: `${followingId}`,
        message: objectMessage
      }

      const notificationFeed = this.client.feed('notification', `${followingId}`);

      await notificationFeed.addActivity(objectFollowActivity);

      await followingUser.sendPush({ body: objectMessage, data: { userId }})

      const actorFollowActivity = {
        ...followActivity,
        foreign_id: `${userId}`,
        message: `You followed ${followingUser.username}`
      }

      const creatorNotificationFeed = this.client.feed('notification', `${userId}`);

      await creatorNotificationFeed.addActivity(actorFollowActivity);
    }

    const response = await User.getSingle({ client: this.client, id: userId, redis: this.redis });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

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
  postUserFollow,
  putUser
};
