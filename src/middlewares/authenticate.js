const jwt = require('jsonwebtoken');

/**
 * To be used to authenticate user
 */
module.exports = function authentication(req, res, next) {
  const token = req.header('token');
  if (!token) return res.status(401).send('Access Denied: No token provided');

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
};
