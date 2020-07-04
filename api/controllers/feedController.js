const { Comment, Guess, Post } = require('../db/db');

const getFeed = async (req, res) => {
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
