/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Funding } = require('../models/smes/sme.funding.model');
const { User } = require('../models/user.model');
const { Sme } = require('../models/smes/sme.model');


// retrieved an fundings
exports.fundingDetail = async (req, res) => {
  Funding.findById(req.params.id, (err, funding) => {
    if (err) return res.status(500).send({ status: 'error', message: err.message });
    if (!funding) return res.status(404).send({ status: 'error', message: 'No funding found' });

    res.status(200).send({ status: 'success', data: funding });
  }).populate(['funder', 'sme']);
};


// list all fundings
exports.fundingList = async (req, res) => {
  const fundings = await Funding.find();

  if (_.isEmpty(fundings)) return res.status(404).send({ status: 'error', message: 'No funding found' });

  res.status(200).send({ status: 'success', data: fundings });
};


// Create an funding
exports.createFunding = async (req, res) => {
  // validate request body: to be done later

  // An sme can be funded by same sme multiple time,
  // For now we are not checking for uniqueness of funding by funder to same an sme

  // validate funder:
  // used req.user._id to cover for deleted users or (expired token: handle at middleware)
  const funder = await User.findById(req.user._id);

  const message = {
    status: 'error',
    message: 'Bad request',
    hint: 'Try login-out and login again'
  };

  if (!funder) return res.status(400).send(message);

  const sme = await Sme.findById(req.params.smeId);

  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });

  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  const funding = new Funding({
    sme: sme._id,
    funder: funder._id,
    capital: req.body.capital,
    origin: req.body.origin,
    _type: req.body._type
  });

  await funding.save();

  res.status(201).send({ status: 'success', data: funding });
};


// Delete an sme
exports.destroyFunding = async (req, res) => {
  const funding = await Funding.findByIdAndRemove(req.params.id);
  if (!funding) return res.status(404).send('Funding not found');
  res.status(200).send({ status: 'success', data: funding });
};


exports.updateFunding = async (req, res) => {
  // validate funder:
  // used req.user._id to cover for deleted users or (expired token: handle at middleware)
  const funder = await User.findById(req.user._id);

  const message = {
    status: 'error',
    message: 'Bad request',
    hint: 'Try login-out and login again'
  };

  if (!funder) return res.status(400).send(message);

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  await Funding.findByIdAndUpdate(req.params.id, {
    sme: sme._id,
    funder: funder._id,
    capital: req.body.capital,
    origin: req.body.origin,
    _type: req.body._type
  },
  { new: true, useFindAndModify: false }, async (error, funding) => {
    if (error) return res.status(404).send(error);

    if (!funding) return res.status(404).send({ status: 'error', message: 'funding not found ' });

    res.status(200).send({ status: 'success', data: funding });
  });
};
