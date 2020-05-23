/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const { logger } = require('../startups/logging');
const { User } = require('../models/user.model');

const defaultUser = async () => {
  /**
   * defines default admin(user)
   */

  if (process.env.NODE_ENV === 'development') {
    const password = 'vibrAnium';
    const data = {
      name: 'devano',
      email: 'devano@this.com',
      password
    };

    // Check if this admin has been created
    let user = await User.findOne({ email: data.email });
    if (user) {
      return logger.info(`An admin user was created with the following details:
      id: ${user._id}
      email: ${user.email}
      password: ${password}
    `);
    }

    user = new User(data);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.userType = 'admin';

    await user.save();

    logger.info(`An admin user has been created with the following details:
      id: ${user._id}
      email: ${user.email}
      password: ${password}
    `);
  }
};

// used at ../startups/db
exports.initialise = () => {
  // create local admin
  defaultUser();
};
