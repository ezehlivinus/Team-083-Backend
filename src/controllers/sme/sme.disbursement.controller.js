/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Funding } = require('../../models/smes/sme.funding.model');
const { Sme } = require('../../models/smes/sme.model');
const { FundRequest } = require('../../models/smes/sme.fundRequest.model');
const { Disbursement } = require('../../models/smes/sme.disbursement.model');


// retrieved a disbursement
exports.disbursementDetail = async (req, res) => {
  Disbursement.findById(req.params.id, (error, disbursement) => {
    if (error) return res.status(500).send({ status: 'error', message: error.message });
    if (!disbursement) return res.status(404).send({ status: 'error', message: 'No fund disbursement found' });

    res.status(200).send({ status: 'success', data: disbursement });
  }).populate(['sme', 'fundRequest']);
};


// list all disbursement
exports.disbursementList = async (req, res) => {
  const disbursement = await Disbursement.find();

  if (_.isEmpty(disbursement)) return res.status(404).send({ status: 'error', message: 'No fund disbursement found' });

  res.status(200).send({ status: 'success', data: disbursement });
};


// Create a disbursement
exports.createDisbursement = async (req, res) => {
  // validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   Validate sme funding
  const funding = await Funding.findOne({ sme: sme._id });
  if (!funding) return res.status(400).send({ status: 'error', message: 'Bad request' });

  // validate fundRequest
  const fundRequest = await FundRequest.findById(req.params.fundRequestId);
  if (!fundRequest) return res.status(400).send({ status: 'error', message: 'Invalid fund request...' });

  //   validate req.amount
  if (req.body.amount > funding.balance) return res.status(400).send({ status: 'error', message: 'Insufficient balance' });
  if (req.body.amount <= 0) return res.status(400).send({ status: 'error', message: 'Invalid amount, the amount is too low' });

  //   withdraw from funding
  funding.balance -= req.body.amount;
  await funding.save();

  //  save fund disbursement
  const disbursement = new Disbursement({
    sme: sme._id,
    fundRequest: fundRequest._id,
    amount: req.body.amount,
    balance: funding.balance
  });

  await disbursement.save();

  res.status(201).send({ status: 'success', data: disbursement });
};


// Delete a disbursement
exports.destroyDisbursement = async (req, res) => {
//   for now we do not want user to delete fund disbursement,
// esp. when the fund has been disbursed for disbursement
// To be implemented

  //   Validate sme funding
  const funding = await Funding.findOne({ sme: req.smeId });
  if (!funding) return res.status(400).send({ status: 'error', message: 'Bad request' });

  const disbursement = await Disbursement.findByIdAndRemove(req.params.id);
  if (!disbursement) return res.status(404).send('Funding not found');

  funding.balance += disbursement.amount;
  await funding.save();

  res.status(200).send({ status: 'success', data: disbursement });
};


// Update  a disbursement
exports.updateDisbursement = async (req, res) => {
// validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   Validate sme funding
  const funding = await Funding.findOne({ sme: sme._id });
  if (!funding) return res.status(400).send({ status: 'error', message: 'Bad request' });

  // validate fundRequest
  const fundRequest = await FundRequest.findById(req.params.fundRequestId);
  if (!fundRequest) return res.status(400).send({ status: 'error', message: 'Invalid fund request...' });

  //   validate disbursement
  const disbursement = await Disbursement.findById(req.params.id);
  if (!disbursement) return res.status(400).send({ status: 'error', message: 'Invalid disbursement...' });


  // check balance sufficiency
  if (req.body.amount > funding.balance) {
    // Try: predict if previous fund disbursement + balance is
    // greater than current fund disbursement(sent from/by form/client)
    // ...since we will still return previous disbursement
    const predictBalance = funding.balance + disbursement.amount > req.body.amount;
    if (!predictBalance) return res.status(400).send({ status: 'error', message: 'Insufficient balance' });
  }

  //   check amount
  if (req.body.amount <= 0) return res.status(400).send({ status: 'error', message: 'amount should be greater than zero' });

  // return the previous fund disbursement back to funding
  funding.balance += disbursement.amount;
  //  withdraw: make this new fund request
  funding.balance -= req.body.amount;

  disbursement.amount = req.body.amount;
  disbursement.balance = funding.balance;
  await disbursement.save();

  // saving is done here intentionally,
  // so that if disbursement has error, funding changes will be discarded
  await funding.save();

  res.status(200).send({ status: 'success', data: disbursement });
};
