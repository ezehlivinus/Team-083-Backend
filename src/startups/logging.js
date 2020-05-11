const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
require('dotenv').config();

const exceptRejectLogger = () => {
  // uncaught Exception
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' })
  );

  // promise rejection that was not handled
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'logs/unhandledRejection.log' }));
  winston.add(new winston.transports.MongoDB({ db: process.env.DB_CONNECTION_STRING }));
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

exports.logger = logger;
exports.exceptRejectLogger = exceptRejectLogger;
