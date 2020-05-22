const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorise = require('../middlewares/authorise');
const controller = require('../controllers/userController');

/**
 * Define user routes
 * Using base: auth/users
 */

router.get('/:id', [authenticate], controller.userDetail);
router.get('/', [authenticate], controller.userList);
// upon registration all users are of type user, except admin whose case will be treated later
// There will be a different route that handles admin registration, or another solution
router.post('/', controller.createUser);
router.put('/:id', [authenticate], controller.updateUser);
router.delete('/:id', [authenticate], controller.destroyUser);
router.post('/login', controller.loginUser);
// router.post('/logout', controller.logoutUser);

module.exports = router;
