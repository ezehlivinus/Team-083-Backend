const express = require('express');
const error = require('../middlewares/error')

const users = require('../routes/userRoute');

const basePath = '/api/v1';


module.exports = function (app) {
  app.use(express.json());
  app.use(`${basePath}/users`, users);

  // Error middleware
  app.use(error);
};
