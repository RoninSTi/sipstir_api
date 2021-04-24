const { BlockedUser } = require('../db/db');

async function getBlockedUsers(req, res) {
  console.log({ user: req.user })
  const { id: userId } = req.user;

  try {
    const response = await BlockedUser.blockedUserResponse({ userId });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function postBlockUser(req, res) {
  const { blockedId } = req.params;
  const { id: userId } = req.user;

  try {
    const [blockedUser, created] = await BlockedUser.findOrCreate({
      where: {
        blockedId,
        userId,
      }
    });

    if (created) {
      blockedUser.blocked = true

      await blockedUser.save()
    } else {
      const blocked = blockedUser.getDataValue('blocked')

      blockedUser.blocked = !blocked

      await blockedUser.save()
    }

    const response = await BlockedUser.blockedUserResponse({ userId });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getBlockedUsers,
  postBlockUser,
}
