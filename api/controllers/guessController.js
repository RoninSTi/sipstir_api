const { Comment, Guess, User, Post } = require('../db/db');

async function postGuessComment(req, res) {
  const { guessId } = req.params;
  const { createdById, text } = req.body;

  try {
    const guess = await Guess.findByPk(guessId);

    const comment = await Comment.create({ text });

    const user = await User.findByPk(createdById);

    await comment.setCreatedBy(user);

    await guess.addComment(comment);

    const guessActivity = {
      actor: `${createdById}`,
      verb: 'comment',
      object: `guess:${guess.id}`,
      post: `${guess.PostId}`,
      time: new Date(),
    }

    if (createdById !== guess.createdById) {
      const guessNotificationFeed = this.client.feed('notification', `${guess.createdById}`);

      await guessNotificationFeed.addActivity(guessActivity);
    } else {
      const creatorNotificationFeed = this.client.feed('notification', `${createdById}`);

      await creatorNotificationFeed.addActivity(guessActivity);
    }

    const post = await Post.findByPk(guess.PostId);

    const postActivity = {
      actor: `${createdById}`,
      verb: 'comment',
      object: `post:${post.id}`,
      guess: `${guess.id}`,
      time: new Date(),
    }

    if (createdById !== post.createdById) {
      const postNotificationFeed = this.client.feed('notification', `${post.createdById}`);

      await postNotificationFeed.addActivity(postActivity);
    } else {
      const creatorNotificationFeed = this.client.feed('notification', `${createdById}`);

      await creatorNotificationFeed.addActivity(postActivity);
    }

    const response = await Post.getSingle({ id: guess.PostId, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  postGuessComment
};
