const Sequelize = require('sequelize');
const { BlockedUser, Comment, Guess, Location, Post, ReportedPost, sequelize, User } = require('../db/db');
const Op = Sequelize.Op;


async function getFeed(req, res) {
  const { feedType, userId } = req.params;
  const { page = 1, pageSize = 100 } = req.query;

  const offset = (page * pageSize) - pageSize;
  const limit = pageSize;

  try {
    let query = {
      include: Post.getNestedInclude(),
      offset: offset,
      limit: limit,
      order: [
        ['createdAt', 'DESC'],
        [{ model: Guess, as: 'guesses' }, 'createdAt', 'ASC'],
        [
          { model: Guess, as: 'guesses' },
          { model: Comment, as: 'comments' }, 'createdAt', 'ASC',
        ],
      ]
    }

    if (feedType === 'user') {
      query = {
        ...query,
        where: {
          createdById: userId
        }
      };
    }

    if (feedType === 'following') {
      const timelineFeed = this.client.feed('timeline', `${userId}`);

      const timelineFeedResponse = await timelineFeed.get({ limit, offset });

      const postIds = timelineFeedResponse.results.map(activity => {
        const { object } = activity;

        const postId = parseInt(object.split(':')[1]);

        return postId;
      });

      query = {
        ...query,
        where: {
          id: postIds
        }
      };
    }

    if (feedType === 'location') {
      const { locationId } = req.query

      const comparisionTime = new Date()

      comparisionTime.setHours(comparisionTime.getHours - 12);

      query = {
        ...query,
        where: {
          locationId,
          createdAt: {
            [Op.lte]: comparisionTime
          }
        }
      }
    }

    if (feedType === 'nearby') {
      const { lat, lng, radius } = req.query;

      const attributes = ['id'];

      var location = sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);

      var distance = sequelize.fn('ST_Distance_Sphere', sequelize.literal('geometry'), location);

      attributes.push([distance, 'distance']);

      const inRadius = await Location.findAll({
        attributes,
        where: sequelize.where(distance, { [Op.lte]: radius }),
      })

      const locationIds = inRadius.map(location => location.id)

      query = {
        ...query,
        where: {
          locationId: [locationIds]
        }
      }
    }

    const blockedUsers = await BlockedUser.blockedUserIds({ userId })

    const reportedPosts = await ReportedPost.reportedPostIds({ userId })

    query = {
      ...query,
      where: {
        ...query.where,
        [Op.not]: {
          createdById: blockedUsers.length > 0 ? blockedUsers : null,
        },
        [Op.not]: {
          id: reportedPosts.length > 0 ? reportedPosts : null
        },
      }
    }

    const user = await User.findByPk(userId)

    const hideReported = user.settings?.hideReported

    if (hideReported) {
      query = {
        ...query,
        where: {
          ...query.where,
          [Op.not]: {
            reported: true
          }
        }
      }
    }

    const posts = await Post.findAll({ ...query });

    const rawResponse = posts.map(post => post.toJSON());

    const response = await Post.feedResponse({ rawResponse, userId });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getFeed
};
