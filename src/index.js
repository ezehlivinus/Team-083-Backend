const express = require('express');
require('dotenv').config();
const winston = require('winston');

const app = express();
const { exceptRejectLogger, logger } = require('./startups/logging');


exceptRejectLogger();

require('./startups/db')();
require('./startups/routes')(app);

const isDevelopment = process.env.NODE_ENV === 'development';

const isTest = process.env.NODE_ENV === 'test';

const port = process.env.PORT || 3000;

if (isDevelopment || isTest) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});

module.exports = server;
