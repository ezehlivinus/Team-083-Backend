const express = require('express');
const error = require('../middlewares/error');

const users = require('../routes/users.route');
const smes = require('../routes/smes');

const basePath = '/api/v1';

/**
 * List of routes and middlewares
 */
module.exports = function r(app) {
  app.use(express.json());
  app.use(`${basePath}/auth/users`, users);
  app.use(`${basePath}/smes`, smes);

  // Error middleware
  app.use(error);
};
