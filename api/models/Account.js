// const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  address: {
    admin: String,
    country: String,
    locality: String,
    postalCode: String,
    street1: String,
    street2: String
  },
  avatar: String,
  billingAddress: {
    admin: String,
    country: String,
    locality: String,
    postalCode: String,
    street1: String,
    street2: String
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googlePlaceId: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  collection: 'Accounts'
});

const Account = mongoose.model('Account', accountSchema);

class AccountResponse {
  constructor({
    createdAt, googlePlaceId, id, name
  }) {
    this.createdAt = createdAt;
    this.id = id;
    this.googlePlaceId = googlePlaceId;
    this.name = name;
  }
}

module.exports = {
  Account,
  AccountResponse
}