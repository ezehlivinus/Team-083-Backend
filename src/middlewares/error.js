const { logger } = require('../startups/logging');
// handles middleware error and those that may occur in controller
module.exports = (error, req, res, next) => {
  logger.error(error.message, error);

  const data = {
    status: 'error',
    message: 'Something failed...',
    'graceful-details': error.message
  };

  return res.status(500).send(data);
};
