const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const controller = require('../controllers/sme.controller');

const fInterestController = require('../controllers/funder/interest.controller');

const fundingController = require('../controllers/sme.funding.controller');

const fundRequestController = require('../controllers/sme.fundRequest.controller');

/**
 * Define sme routes, funder-interest routes
 * Using base: /smes
 */


// --------------------------------------------------------------------//
/**
 * SME ROUTES
 * fullPath: api/v1/smes
 */
router.get('/:id', [authenticate], controller.smeDetail);
router.get('/', [authenticate], controller.smeList);
router.delete('/:id', [authenticate], controller.destroySme);
/**
 * createSme and updateSme sample data
 * {
 * "name": "Venture Capital",
 * "rc": 1234566865203,
 * "summary": "This all about my venture and it also include others",
 * "categories": ["tech", "AI", "ML"]
 * }
 */
router.post('/', [authenticate], controller.createSme);
router.put('/:id', [authenticate], controller.updateSme);


// --------------------------------------------------------------------//
/**
 * FUNDER INTEREST ROUTES
 * fullPath: api/v1/smes/smeId/interests
 *
 * There will a be a middleware that will:
 * 1. Only allow founders to view their own interests
 * 2. Only allow funders to view their all their interest
 */

const basePath = '/:smeId/interests';

router.get(`${basePath}/:id`, [authenticate], fInterestController.interestDetail);
router.get(`${basePath}`, [authenticate], fInterestController.interestList);
router.post(`${basePath}`, [authenticate], fInterestController.createInterest);


// --------------------------------------------------------------------//

/**
 * FUNDING INTEREST ROUTES
 * fullPath: api/v1/smes/smeId/fundings
 */
const fundingPath = '/:smeId/fundings';

router.get(`${fundingPath}/:id`, [authenticate], fundingController.fundingDetail);
router.get(`${fundingPath}`, [authenticate], fundingController.fundingList);
/**
 * sample data for create and update
 * {
 * "capital": 15000,
 * "origin": true,
 * "_type": "Grant"
 * }
 */
router.post(fundingPath, [authenticate], fundingController.createFunding);
router.put(`${fundingPath}/:id`, [authenticate], fundingController.updateFunding);
router.delete(`${fundingPath}/:id`, [authenticate], fundingController.destroyFunding);


// --------------------------------------------------------------------//
/**
 * FUND REQUEST ROUTES
 * fullPath: api/v1/smes/smeId/fund-requests
 */

const fundRequestPath = '/:smeId/fund-requests';
router.get(`${fundRequestPath}`, [authenticate], fundRequestController.fundRequestList);
router.get(`${fundRequestPath}/:id`, [authenticate], fundRequestController.fundRequestDetail);
// sample data
// {
// 	"milestone": "some milestones' title",
// 	"amount": 3000,
//  "description": "not compulsory"
// }
router.post(fundRequestPath, [authenticate], fundRequestController.createFundRequest);
router.put(`${fundRequestPath}/:id`, [authenticate], fundRequestController.updateFundRequest);


// --------------------------------------------------------------------//
/**
 * FUND DISBURSEMENT
 * full path: api/v1/smes/smeId/fund-requests/fundRequestId/disbursements
 */
const disbursementController = require('../controllers/sme/sme.disbursement.controller');
const authorise = require('../middlewares/authorise');

const disbursementPath = '/:smeId/fund-requests/:fundRequestId/disbursements';
router.get(`${disbursementPath}/:id`, [authenticate, authorise.isAdmin], disbursementController.disbursementDetail);
router.get(`${disbursementPath}`, [authenticate, authorise.isAdmin], disbursementController.disbursementList);
/**
 * sample data
 * { "amount": 2000 }
 * other data are gotten from url
 */
router.post(`${disbursementPath}`, [authenticate, authorise.isAdmin], disbursementController.createDisbursement);
router.put(`${disbursementPath}/:id`, [authenticate, authorise.isAdmin], disbursementController.updateDisbursement);
router.delete(`${disbursementPath}/:id`, [authenticate, authorise.isAdmin], disbursementController.destroyDisbursement);


module.exports = router;
