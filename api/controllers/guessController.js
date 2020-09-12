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

    const commentActivity = {
      actor: `${createdById}`,
      verb: 'comment',
      object: `guess:${guess.id}`,
      postId: `${guess.PostId}`,
      time: new Date(),
    }

    if (createdById === guess.createdById) {
      const activity = {
        ...commentActivity,
        message: 'You commented on your guess'
      }

      const selfNotificationFeed = this.client.feed('notification', `${createdById}`);

      await selfNotificationFeed.addActivity(activity);
    } else {
      const guessUser = await User.findByPk(guess.createdById)

      const actorActivity = {
        ...commentActivity,
        foreign_id: `${createdById}`,
        message: `You commented on ${guessUser.username}'s guess`
      }

      const actorNotificationFeed = this.client.feed('notification', `${createdById}`);

      await actorNotificationFeed.addActivity(actorActivity)

      const objectMessage = `${user.username} commented on your guess`

      const objectActivity = {
        ...commentActivity,
        foreign_id: `${guess.createdById}`,
        message: objectMessage
      }

      const objectNotificationFeed = this.client.feed('notification', `${guess.createdById}`)

      await objectNotificationFeed.addActivity(objectActivity)

      await guessUser.sendPush({ body: objectMessage, data: { postId: guess.PostId }})
    }

    const post = await Post.findByPk(guess.PostId);

    if (createdById !== post.createdById) {
      const postUser = await User.findByPk(post.createdById)

      const postMessage = `${user.username} commented on a guess in your post`

      const postCommentActivity = {
        actor: `${createdById}`,
        verb: 'comment',
        object: `post:${post.id}`,
        guessId: `${guess.id}`,
        time: new Date(),
        message: postMessage
      }

      const postNotificationFeed = this.client.feed('notification', `${post.createdById}`);

      await postNotificationFeed.addActivity(postCommentActivity);

      await postUser.sendPush({ body: postMessage, data: { postId: post.id }})
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
