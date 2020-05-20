
module.exports = function isAdmin(req, res, next) {

  if (req.user.userType.name !== 'admin') {
    return res.status(403).send('Access Denied');
  }
  return next();
};

exports.isAuthorised = (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  if (req.user._id !== req.params.id) {
    return res.status(403).send('Access Denied...');
  }
  return next();
};
