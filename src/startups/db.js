const mongoose = require('mongoose');
const { logger } = require('./logging');
require('dotenv').config();


module.exports = (function database() {
  const db = process.env.DB_CONNECTION_STRING;
  mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => logger.info(`Connected to ${process.env.NODE_ENV} database...`));
});
