const { Cheer, Comment, Guess, Location, Post, User } = require('../db/db');

const getPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query;

  try {
    const post = await Post.getSingle({ id: postId, userId })

    res.send(post);
  } catch (error) {
    res.send(error);
  }
}

const getPostCheers = async (req, res) => {
  const { postId } = req.params;

  try {
    const cheers = await Cheer.findAll({
      include: [{ all: true, nested: true }],
      where: {
        postId: postId
      }
    });

    const response = cheers.map(cheer => cheer.toJSON());

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function postCheers(req, res) {
  const { createdById } = req.body;
  const { postId } = req.params;

  try {
    const [cheer, created] = await Cheer.findOrCreate({
      where: {
        createdById,
        postId
      }
    });

    if (created) {
      cheer.isCheered = true;
    } else {
      cheer.isCheered = !cheer.isCheered
    }

    await cheer.save()

    if (cheer.isCheered) {
      await Post.increment(['cheers'], {
        where: {
          id: postId
        }
      });

      const post = await Post.findByPk(postId);

      const cheersActivity = {
        actor: `${createdById}`,
        verb: 'cheers',
        object: `post:${postId}`,
        postUserId: `user:${post.createdById}`,
        time: new Date(),
      }

      const notificationFeed = this.client.feed('notification', `${post.createdById}`);

      await notificationFeed.addActivity(cheersActivity);

      const creatorNotificationFeed = this.client.feed('notification', `${createdById}`);

      await creatorNotificationFeed.addActivity(cheersActivity);
    } else {
      await Post.decrement(['cheers'], {
        where: {
          id: postId
        }
      });
    }

    const response = await Post.getSingle({ id: postId, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function postGuess(req, res) {
  const { placeId, createdById, text } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);

    let correct = false;

    let location = null;

    if (placeId) {
      location = await Location.createLocationFromPlaceId(placeId);

      correct = post.locationId === location.id;
    }

    const guess = await Guess.create({
      correct
    });

    const user = await User.findByPk(createdById);

    await guess.setCreatedBy(user);

    await user.addPoints({ amount: correct ? 5 : 1, redis: this.redis });

    if (location) {
      await guess.setLocation(location);
    }

    const guessActivity = {
      actor: `${createdById}`,
      verb: 'guess',
      object: `post:${post.id}`,
      guess: `${guess.id}`,
      correct,
      time: new Date(),
    };

    const notificationFeed = this.client.feed('notification', `${post.createdById}`);

    await notificationFeed.addActivity(guessActivity);

    const creatorNotificationFeed = this.client.feed('notification', `${createdById}`);

    await creatorNotificationFeed.addActivity(guessActivity);

    if (text) {
      const comment = await Comment.create({ text });

      await comment.setCreatedBy(user);

      await guess.addComment(comment);
    }

    await post.addGuess(guess);

    if (correct) {
      await Post.increment(['guessesCorrect'], {
        where: {
          id: postId
        }
      });
    } else {
      await Post.increment(['guessesWrong'], {
        where: {
          id: postId
        }
      });
    }

    const response = await Post.getSingle({ id: postId, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function postPost(req, res) {
  const { createdById, locationId, ...postData } = req.body;

  try {
    const post = await Post.create({ ...postData });

    const location = await Location.findByPk(locationId);

    const user = await User.findByPk(createdById);

    await user.addPoints({ amount: 10, redis: this.redis });

    await post.setLocation(location);

    await post.setCreatedBy(user);

    const userFeed = this.client.feed('user', `${createdById}`);

    await userFeed.addActivity({
      actor: `${createdById}`,
      verb: 'post',
      object: `post:${post.id}`,
      foreign_id: `post:${post.id}`,
      location: `location:${location.id}`,
      time: new Date(),
    });

    const response = await Post.getSingle({ id: post.id, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getPost,
  getPostCheers,
  postCheers,
  postGuess,
  postPost
};
