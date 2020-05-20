/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const UserType = require('../models/userType');
const { logger } = require('../startups/logging');
const { User } = require('../models/user');

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

    // upon registration all user are of type user
    const userType = await UserType.find({ name: 'admin' }).populate('userType');
    user.userType = userType.map((type) => type._id);

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
  UserType.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      try {
        new UserType({ name: 'user' }).save();
        logger.info('Added user to  userTypes collection');

        new UserType({ name: 'founder' }).save();
        logger.info('Added  founder to  userTypes collection');

        new UserType({ name: 'funder' }).save();
        logger.info('Added funder to  userTypes collection');

        new UserType({ name: 'admin' }).save();
        logger.info('Added admin to userType collection');

      } catch (error) {
        logger.info('error', error);
      }
    }
    // create local admin
    defaultUser();
  });
};
