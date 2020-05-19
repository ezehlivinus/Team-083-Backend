const express = require('express');

const router = express.Router();

const controller = require('../controllers/userController');

/**
 * Define user routes
 * Using base: auth/users
 */

router.get('/:id', controller.userDetail);
router.get('/', controller.userList);
// upon registration all user are of type user, except admin who case will be treated later
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.destroyUser);
// There will be a different route that handles admin registration


module.exports = router;
