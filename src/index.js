const express = require('express');
require('dotenv').config();
const winston = require('winston');
const mongoose = require('mongoose');
const { exceptRejectLogger, logger } = require('./utility/logging');
const routes = require('./routes/route');
const bodyParser = require('body-parser');
const app = express();

exceptRejectLogger();

/* Connect to Mongodb */

mongoose.connect(process.env.DB_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(() => logger.info(`Connected to ${process.env.NODE_ENV} database...`));

app.use(bodyParser.json());

/* Allow cross origin */

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, token');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  next();

});

/* Cross Origin options request */

app.options('*', (req, res, next) => res.status(200).json());

routes(app);

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
