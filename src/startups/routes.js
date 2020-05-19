const express = require('express');
const error = require('../middlewares/error');

const users = require('../routes/users');

const basePath = '/api/v1';

/**
 * List of routes and middlewares
 */
module.exports = function r(app) {
  app.use(express.json());
  app.use(`${basePath}/auth/users`, users);

  // Error middleware
  app.use(error);
};
