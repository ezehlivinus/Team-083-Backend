const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const smeController = require('../controllers/sme.controller');

const interestController = require('../controllers/funder/interest.controller');

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
router.get('/:id', [authenticate], smeController.smeDetail);
router.get('/', [authenticate], smeController.smeList);
router.delete('/:id', [authenticate], smeController.destroySme);
/**
 * createSme and updateSme sample data
 * {
 * "name": "Venture Capital",
 * "rc": 1234566865203,
 * "summary": "This all about my venture and it also include others",
 * "categories": ["tech", "AI", "ML"]
 * }
 */
router.post('/', [authenticate], smeController.createSme);
router.put('/:id', [authenticate], smeController.updateSme);


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

router.get(`${basePath}/:id`, [authenticate], interestController.interestDetail);
router.get(`${basePath}`, [authenticate], interestController.interestList);
router.post(`${basePath}`, [authenticate], interestController.createInterest);


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


// --------------------------------------------------------------------//
/**
 * SME PROGRESS ROUTES
 * FULL PATH: api/v1/smes/smeId/progresses
 */
const progressController = require('../controllers/sme/sme.progress.controller');

const progressPath = '/:smeId/progresses';

router.get(`${progressPath}/:id`, [authenticate], progressController.progressDetail);
router.get(`${progressPath}`, [authenticate], progressController.progressList);
/**
 * {
 * "description": "some description",
 * "title": "some title"
 * }
 */
router.post(`${progressPath}`, [authenticate], progressController.createProgress);
router.put(`${progressPath}/:id`, [authenticate], progressController.updateProgress);
router.delete(`${progressPath}/:id`, [authenticate], progressController.destroyProgress);

// --------------------------------------------------------------------//
/**
 * SME EXPENSE ROUTES
 * FULL PATH: api/v1/smes/smeId/expenses
 */
const expenseController = require('../controllers/sme/sme.expense.controller');

const expensePath = '/:smeId/expenses';

router.get(`${expensePath}`, [authenticate], expenseController.expenseList);
router.get(`${expensePath}/:id`, [authenticate], expenseController.expenseDetail);
/**
 * {
 * "title": "Expense title changed",
 * "description": "if any changed",
 * "amount": 1000,
 * "reference": "Changed url or any code/ref to this expense this can be on the description as well"
 * }
 */
router.post(`${expensePath}`, [authenticate], expenseController.createExpense);
router.put(`${expensePath}/:id`, [authenticate], expenseController.updateExpense);
router.delete(`${expensePath}/:id`, [authenticate], expenseController.destroyExpense);


// --------------------------------------------------------------------//
/**
 * SME VERIFICATION/AUDITION ROUTES
 * FULL PATH: api/v1/smes/smeId/verification
 * makes use of sme.controller.js
 */

/**
 * sample data
 * { "isVerified": true, "isSuspended": false }
 */
router.put('/:smeId/audits', [authenticate, authorise.isAdmin], smeController.auditSme);


module.exports = router;
