const { Cheer, Comment, Guess, Location, Post, User } = require('../db/db');

const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.getSingle({ id: postId })

    res.send(post);
  } catch (error) {
    res.send(error);
  }
}

const postCheers = async (req, res) => {
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

const postGuess = async (req, res) => {
  const { placeId, createdById, text } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);

    const location = await Location.createLocationFromPlaceId(placeId);

    const user = await User.findByPk(createdById);

    await user.addPoints({ amount: 5 });

    const correct = post.locationId === location.id;

    const guess = await Guess.create({
      correct
    });

    await guess.setCreatedBy(user);

    await guess.setLocation(location);

    if (text) {
      const comment = await Comment.create({ text });

      await comment.setCreatedBy(user);

      await guess.addComment(comment);
    }

    await post.addGuess(guess);

    const response = await Post.getSingle({ id: postId, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

const postPost = async (req, res) => {
  const { createdById, locationId, ...postData } = req.body;

  try {
    const post = await Post.create({ ...postData });

    const location = await Location.findByPk(locationId);

    const user = await User.findByPk(createdById);

    await user.addPoints({ amount: 10 });

    await post.setLocation(location);

    await post.setCreatedBy(user);

    const response = Post.getSingle({ id: post.id, userId: createdById });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getPost,
  postCheers,
  postGuess,
  postPost
};
