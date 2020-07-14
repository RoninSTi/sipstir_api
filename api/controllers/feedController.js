const { Comment, Guess, Post } = require('../db/db');

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
