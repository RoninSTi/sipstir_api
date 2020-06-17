// const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const accountUserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'AccountUsers'
});

const User = mongoose.model('User', userSchema);

class UserResponse {
  constructor({
    avatar, createdAt, email, id, pushToken, updatedAt, username
  }) {
    this.avatar = avatar;
    this.createdAt = createdAt;
    this.email = email;
    this.id = id;
    this.pushToken = pushToken;
    this.updatedAt = updatedAt;
    this.username = username;
  }
}

class UsernameCheckResponse {
  constructor({
    usernameExists
  }) {
    this.usernameExists = usernameExists;
  }
}

module.exports = {
  User,
  UserResponse,
  UsernameCheckResponse
}