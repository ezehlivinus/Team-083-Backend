/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Funding } = require('../models/smes/sme.funding.model');
const { User } = require('../models/user.model');
const { Sme } = require('../models/smes/sme.model');
const { FundRequest } = require('../models/smes/sme.fundRequest.model');


// retrieved a fundRequest
exports.fundRequestDetail = async (req, res) => {
  FundRequest.findById(req.params.id, (err, fundRequest) => {
    if (err) return res.status(500).send({ status: 'error', message: err.message });
    if (!fundRequest) return res.status(404).send({ status: 'error', message: 'No fund request found' });

    res.status(200).send({ status: 'success', data: fundRequest });
  }).populate('sme');
};


// list all fundRequest
exports.fundRequestList = async (req, res) => {
  const fundRequest = await FundRequest.find();

  if (_.isEmpty(fundRequest)) return res.status(404).send({ status: 'error', message: 'No fund request found' });

  res.status(200).send({ status: 'success', data: fundRequest });
};


// Create a fundRequest
exports.createFundRequest = async (req, res) => {
  // validate request body: to be done later, clean some code up

  // validate funder:
  // used req.user._id to cover for deleted users or (expired token: handle at middleware)
  const user = await User.findById(req.user._id);
  const message = { status: 'error', message: 'Bad request', hint: 'Try login-out and login again' };
  if (!user) return res.status(400).send(message);

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   Validate sme funding
  const funding = await Funding.findOne({ sme: sme._id });
  if (!funding) return res.status(400).send({ status: 'error', message: 'Bad request' });

  if (req.body.amount > funding.balance) return res.status(400).send({ status: 'error', message: 'Insufficient balance' });

  //  save fund request
  const fundRequest = new FundRequest({
    sme: sme._id,
    ...req.body
  });

  await fundRequest.save();

  res.status(201).send({ status: 'success', data: fundRequest });
};


// Delete a fundRequest
exports.destroyFundRequest = async (req, res) => {
//   for now we do not want user to delete fund request,
// esp. when the fund has been disbursed for request
// To be implemented
};


// Update  a fundRequest
exports.updateFundRequest = async (req, res) => {
// validate request body: to be done later, clean some code up

  // validate funder:
  // used req.user._id to cover for deleted users or (expired token: handle at middleware)
  const user = await User.findById(req.user._id);
  const message = { status: 'error', message: 'Bad request', hint: 'Try login-out and login again' };
  if (!user) return res.status(400).send(message);

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   Validate sme funding
  const funding = await Funding.findOne({ sme: sme._id });
  if (!funding) return res.status(400).send({ status: 'error', message: 'Bad request' });

  //   validate fundRequest
  const previousFundRequest = await FundRequest.findById(req.params.id);
  if (!previousFundRequest) return res.status(400).send({ status: 'error', message: 'No fund request found' });

  // check balance sufficiency
  if (req.body.amount > funding.balance) {
    // predict if previous fund request + balance is 
    // greater than current fund request(updated from form)
    const predictBalance = funding.balance + previousFundRequest.amount > req.body.amount;
    if (!predictBalance) return res.status(400).send({ status: 'error', message: 'Insufficient balance' });
  }

  if (req.body.amount <= 0) return res.status(400).send({ status: 'error', message: 'amount should be greater than zero' });

  // NOTE
  // return the previous fund request back to funding
  // this will be used/done on/during disbursement
  // funding.balance += previousFundRequest.amount;
  // await funding.save();

  await FundRequest.findByIdAndUpdate(req.params.id, {
    sme: sme._id,
    milestone: req.body.milestone,
    description: req.body.description,
    amount: req.body.amount
  },
  { new: true, useFindAndModify: false }, async (error, newFundRequest) => {
    if (error) return res.status(404).send(error);

    if (!newFundRequest) return res.status(404).send({ status: 'error', message: 'fund request not found ' });

    // if (error || !newFundRequest ){
    //   // rollback: NOTE above

    //   return res.send(error);
    // }
    res.status(200).send({ status: 'success', data: newFundRequest });
  });
};
