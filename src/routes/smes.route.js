const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const controller = require('../controllers/sme.controller');
const fInterestController = require('../controllers/funder/interest.controller')


/**
 * Define sme routes, funder-interest routes
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


/**
 * funder interest routes
 * 
 * There will a be a middleware that will:
 * 1. Only allow founders to view their own interests
 * 2. Only allow funders to view their all their interest
 */

const basePath = '/:smeId/interests';

router.get(`${basePath}/:id`, [authenticate], fInterestController.interestDetail);
router.get(`${basePath}`, [authenticate], fInterestController.interestList);
router.post(`${basePath}`, [authenticate], fInterestController.createInterest);
// router.post('/', [authenticate], controller.createInterest);

module.exports = router;
