const { Comment, Guess, User, Post } = require('../db/db');

const postGuessComment = async (req, res) => {
  const { guessId } = req.params;
  const { createdById, text } = req.body;

  try {
    const guess = await Guess.findByPk(guessId);

    const comment = await Comment.create({ text });

    const user = await User.findByPk(createdById);

    await comment.setCreatedBy(user);

    await guess.addComment(comment);

    const response = await Post.getSingle({ id: guess.PostId, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  postGuessComment
};
