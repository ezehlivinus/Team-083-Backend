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

  if (req.body.amount > funding.balance) return res.status(400).send({ status: 'error', message: 'Insufficient balance' });

  //   validate fundRequest
  const fundRequest = await FundRequest.findById(req.params.id);
  if (!fundRequest) return res.status(400).send({ status: 'error', message: 'No fund request found' });

  // This continue later from here: when updating making changes to balances is needed

  //   await FundRequest.findByIdAndUpdate(req.params.id, {
  //     sme: sme._id,
  //     funder: funder._id,
  //     capital: req.body.capital,
  //     origin: req.body.origin,
  //     _type: req.body._type
  //   },
  //   { new: true, useFindAndModify: false }, async (error, funding) => {
  //     if (error) return res.status(404).send(error);

  //     if (!funding) return res.status(404).send({ status: 'error', message: 'funding not found ' });

//     res.status(200).send({ status: 'success', data: funding });
//   });
};
