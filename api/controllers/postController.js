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

      const actorUser = await User.findByPk(createdById);

      const postUser = await User.findByPk(post.createdById);

      const cheersActivity = {
        actor: `${createdById}`,
        verb: 'cheers',
        object: `post:${postId}`,
        time: new Date(),
      }

      if (actorUser.id === postUser.id) {
        const activity = {
          ...cheersActivity,
          message: 'You cheersed your BarSnap'
        }

        const selfNotificationFeed = this.client.feed('notification', `${createdById}`);

        await selfNotificationFeed.addActivity(activity)
      } else {
        const actorActivity = {
          ...cheersActivity,
          foreign_id: `${createdById}`,
          message: `You cheersed ${postUser.username}'s BarSnap`
        }

        const actorNotificationFeed = this.client.feed('notification', `${createdById}`)

        await actorNotificationFeed.addActivity(actorActivity)

        const objectActivity = {
          ...cheersActivity,
          foreign_id: `${post.createdById}`,
          message: `${actorUser.username} cheersed your BarSnap`
        }

        const objectNotificationFeed = this.client.feed('notification', `${post.createdById}`)

        await objectNotificationFeed.addActivity(objectActivity)
      }
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

    const postUser = await User.findByPk(post.createdById)

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
      guessId: `${guess.id}`,
      correct,
      time: new Date(),
    };

    const objectGuessActivity = {
      ...guessActivity,
      foreign_id: `${post.createdById}`,
      message: `${user.username} guessed ${correct ? 'correctly' : 'incorrectly'} on your BarSnap`
    }

    const objectNotificationFeed = this.client.feed('notification', `${post.createdById}`);

    await objectNotificationFeed.addActivity(objectGuessActivity);

    const actorGuessActivity = {
      ...guessActivity,
      foreign_id: `${createdById}`,
      message: `You guessed ${correct ? 'correctly' : 'incorrectly'} on ${postUser.username}'s BarSnap`
    }

    const actorNotificationFeed = this.client.feed('notification', `${createdById}`);

    await actorNotificationFeed.addActivity(actorGuessActivity);

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
