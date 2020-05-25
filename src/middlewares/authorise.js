/**
 * This identified an actor as an admin
 */
exports.isAdmin = (req, res, next) => {

  if (req.user.userType !== 'admin') {
    return res.status(403).send('Access Denied...Unauthorised');
  }
  return next();
};


/**
 * This should be able to determine that this user is authorised to perform a certain action
 */
// exports.isAuthorised = (req, res, next) => {
//   // eslint-disable-next-line no-underscore-dangle
//   if (req.user._id !== req.params.id) {
//     return res.status(403).send('Access Denied...');
//   }
//   return next();
// };
