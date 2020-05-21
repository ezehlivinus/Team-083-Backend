const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const controller = require('../controllers/smeController');

/**
 * Define sme routes
 * Using base: /smes
 */


router.get('/:id', [authenticate], controller.smeDetail);
router.get('/', [authenticate], controller.smeList);
router.delete('/:id', [authenticate], controller.destroySme);


/**
 * createSme and updatedSme sample data
 * {
 * "name": "Venture Capital",
 * "rc": 1234566865203,
 * "summary": "This all about my venture and it also include others",
 * "categories": ["tech", "AI", "ML"]
 * }
 */
router.post('/', [authenticate], controller.createSme);
router.put('/:id', [authenticate], controller.updateSme);


module.exports = router;
