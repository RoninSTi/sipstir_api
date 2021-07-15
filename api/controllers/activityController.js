const { User } = require('../db/db');

async function getAccountActivity(req, res) {
  const { accountId } = req.params

  const { page = 1, pageSize = 100 } = req.query;

  const offset = (page * pageSize) - pageSize;
  const limit = pageSize;

  try {
    const activityFeed = this.client.feed('account_notification', `${accountId}`)

    const activityFeedResponse = await activityFeed.get({ limit, offset })

    const activityObjects = activityFeedResponse.results

    const rawResponse = []

    activityObjects.forEach(({ activities }) => {
      activities.forEach(activity => {
        const activityResponse = {
          createdAt: activity.time,
          createdById: parseInt(activity.actor),
          message: activity.message,
          sortDate: new Date(activity.time),
        };

        rawResponse.push(activityResponse);
      });
    });

    const createdByUserIds = rawResponse.map(rr => rr.createdById)

    const distinctUserIds = [...new Set(createdByUserIds)];

    const users = await User.findAll(
      {
        where: {
          id: distinctUserIds
        }
      }
    );

    const sortedActivities = rawResponse.slice().sort((a, b) => b.sortDate - a.sortDate);

    const response = sortedActivities.map(activity => {
      const createdBy = users.find(u => u.id === activity.createdById).toJSON();

      return {
        createdAt: activity.createdAt,
        createdBy,
        message: activity.message,
      }
    });

    res.send(response)
  } catch (error) {
    res.send(error)
  }
}

async function getActivity(req, res) {
  const { userId } = req.params;
  const { page = 1, pageSize = 100 } = req.query;

  const offset = (page * pageSize) - pageSize;
  const limit = pageSize;

  try {
    const activityFeed = this.client.feed('notification', `${userId}`);

    const activityFeedResponse = await activityFeed.get({ limit, offset });

    const activityObjects = activityFeedResponse.results;

    const rawResponse = [];

    activityObjects.forEach(obj => {
      const { activities, verb } = obj;

      switch (verb) {
        case 'comment':
          activities.forEach(activity => {
            object = activity.object;

            let postId = null;

            if (object.startsWith('post')) {
              postId = parseInt(object.split(':')[1]);
            } else {
              postId = parseInt(activity.post);
            }

            const activityResponse = {
              createdAt: activity.time,
              createdById: parseInt(activity.actor),
              message: activity.message,
              postId,
              sortDate: new Date(activity.time),
              verb: 'comment'
            };

            rawResponse.push(activityResponse);
          });

          break;
        case 'guess':
          activities.forEach(activity => {
            const activityResponse = {
              createdAt: activity.time,
              createdById: parseInt(activity.actor),
              message: activity.message,
              postId: parseInt(activity.object.split(':')[1]),
              sortDate: new Date(activity.time),
              verb: 'guess'
            }

            rawResponse.push(activityResponse);
          });

          break;
        case 'cheers':
          activities.forEach(activity => {
            const activityResponse = {
              createdAt: activity.time,
              createdById: parseInt(activity.actor),
              message: activity.message,
              postId: parseInt(activity.object.split(':')[1]),
              sortDate: new Date(activity.time),
              verb: 'cheers',
            };

            rawResponse.push(activityResponse);
          });

          break;
        case 'follow':
        case 'unfollow':
          activities.forEach(activity => {
            const activityResponse = {
              createdAt: activity.time,
              createdById: parseInt(activity.actor),
              message: activity.message,
              object: parseInt(activity.object.split(':')[1]),
              sortDate: new Date(activity.time),
              verb: 'follow',
            }

            rawResponse.push(activityResponse);
          })

          break;
        default:
          break;
      }
    });

    const createdByUserIds = rawResponse.map(rr => rr.createdById)

    const distinctUserIds = [...new Set(createdByUserIds)];

    const users = await User.findAll(
      {
        where: {
          id: distinctUserIds
        }
      }
    );

    const sortedActivities = rawResponse.slice().sort((a, b) => b.sortDate - a.sortDate);

    const response = sortedActivities.map(activity => {
      const createdBy = users.find(u => u.id === activity.createdById).toJSON();

      const onClick = () => {
        switch (activity.verb) {
          case 'comment':
          case 'guess':
          case 'cheers':
            return {
              action: 'postDetail',
              payload: activity.postId
            }
          case 'follow':
            return {
              action: 'userDetail',
              payload: activity.object
            }
        }
      }

      return {
        createdAt: activity.createdAt,
        createdBy,
        message: activity.message,
        onClick: onClick(),
      }
    });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getAccountActivity,
  getActivity
};
