const mongoose = require('mongoose');

/**
 * Define user types: founder, funder, admin
 *
 */
const UserType = mongoose.model(
  'UserType',
  new mongoose.Schema({
    name: { type: String, default: 'user' }
  })
);

module.exports = UserType;
