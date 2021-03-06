const mongoose = require('mongoose');
const { logger } = require('./logging');
const User = require('../utils/initialiseDefaultUser')

require('dotenv').config();

module.exports = (function database() {
  const db = process.env.DB_CONNECTION_STRING;
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
      logger.info(`Connected to ${process.env.NODE_ENV} database...`);
      User.initialise();
    });
});
