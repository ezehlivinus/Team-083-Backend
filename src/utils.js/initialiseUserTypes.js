const UserType = require('../models/userType');
const { logger } = require('../startups/logging');


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
  });
};

