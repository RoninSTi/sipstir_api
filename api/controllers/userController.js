const { User, UserResponse, UsernameCheckResponse } = require('../models/User');

const getCheckUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({ username: username.toLowerCase() }).exec();

    res.send(new UsernameCheckResponse({ usernameExists: !!existingUser }))
  } catch (error) {
    res.send(error)
  }
}

const postUser = async (req, res) => {
  const { avatar, email, username } = req.body;
  try {
    const user = new User({
      avatar,
      email,
      username
    });

    const newUser = await user.save();
    res.send(new UserResponse({...newUser}));
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getCheckUsername,
  postUser
}