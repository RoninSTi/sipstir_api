// const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  name: String,
  photo: {
    height: Number,
    photoReference: String,
    width: Number
  },
  placeId: {
    type: String,
    required: true
  },
  vicinity: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'Locations'
});

const Location = mongoose.model('Location', locationSchema);

class UserResponse {
  constructor({
    accountId, name, photo, id, placeId, vicinity, createdAt
  }) {
    this.accounts = accounts;
    this.avatar = avatar;
    this.createdAt = createdAt;
    this.email = email;
    this.id = id;
    this.pushToken = pushToken;
    this.role = role;
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