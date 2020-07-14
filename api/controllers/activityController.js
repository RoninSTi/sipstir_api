const { User } = require('../db/db');

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
              createdById: parseInt(activity.actor),
              verb: 'comment',
              createdAt: activity.time,
              sortDate: new Date(activity.time),
              object,
              postId,
            };

            rawResponse.push(activityResponse);
          });

          break;
        case 'guess':
          activities.forEach(activity => {
            const activityResponse = {
              createdById: parseInt(activity.actor),
              verb: 'guess',
              createdAt: activity.time,
              sortDate: new Date(activity.time),
              postId: parseInt(activity.object.split(':')[1]),
              correct: activity.correct || false,
            }

            rawResponse.push(activityResponse);
          });

          break;
        case 'cheers':
          activities.forEach(activity => {
            const activityResponse = {
              createdById: parseInt(activity.actor),
              verb: 'cheers',
              createdAt: activity.time,
              sortDate: new Date(activity.time),
              postId: parseInt(activity.object.split(':')[1]),
            };

            rawResponse.push(activityResponse);
          });

          break;
        case 'follow':
        case 'unfollow':
          activities.forEach(activity => {
            const activityResponse = {
              createdById: parseInt(activity.actor),
              verb: 'follow',
              createdAt: activity.time,
              sortDate: new Date(activity.time),
              object: parseInt(activity.object.split(':')[1])
            }

            rawResponse.push(activityResponse);
          })

          break;
        default:
          break;
      }
    });

    const createdByUserIds = rawResponse.map(rr => rr.createdById)

    const followedUserIds = rawResponse.map(rr => rr.verb === 'follow' || rr.verb === 'unfollow' ? rr.object : null).filter(el => el !== null);

    const userIds = [...createdByUserIds, ...followedUserIds];

    const distinctUserIds = [...new Set(userIds)];

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

      const subject = createdBy.id === userId ? 'You' : createdBy.username;

      const formattedVerb = `${activity.verb}ed`;

      const formattedObject = () => {
        switch (activity.verb) {
          case 'cheers':
            return `your post`;
          case 'comment':
            return `on your ${activity.object.startsWith('guess') ? 'guess' : 'post'}`;
          case 'follow':
          case 'unfollow':
            return `${users.find(u => u.id === activity.object).username}`;
          case 'guess':
            return `${activity.correct ? 'correctly' : 'incorrectly'} on your post`;
        }
      }

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
          case 'unfollow':
            return {
              action: 'userDetail',
              payload: activity.object
            }
        }
      }

      return {
        createdAt: activity.createdAt,
        createdBy,
        message: `${subject} ${formattedVerb} ${formattedObject()}`,
        onClick: onClick(),
      }
    });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getActivity
};
