/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { FunderInterest } = require('../../models/funder/interest.model');
const { Sme } = require('../../models/smes/sme.model');
const { User } = require('../../models/user.model');


// retrieved an sme
exports.interestDetail = async (req, res) => {
  FunderInterest.findById(req.params.id, (err, interest) => {
    if (err) return res.status(500).send({ status: 'error', message: err.message });
    if (!interest) return res.status(404).send({ status: 'error', message: 'No interest found' });

    res.status(200).send({ status: 'Success', data: interest });
  }).populate(['funder', 'sme']);
};


// list all interest
exports.interestList = async (req, res) => {
  // we may not want to populate funder and sme like above for performance
  const interest = await FunderInterest.find();

  if (_.isEmpty(interest)) return res.status(404).send({ status: 'error', message: 'No interest found' });

  res.status(200).send({ status: 'success', data: interest });
};


// Create an interest
exports.createInterest = async (req, res) => {
  // validate request body: to be done later

  // Check if this founder has shown interest in this sme before
  if (await FunderInterest.findOne({ funder: req.user._id, sme: req.params.smeId })) {
    return res.status(400).send({
      status: 'error',
      message: 'You have previously indicated interest'
    });
  }

  const interest = new FunderInterest({
    funder: req.user._id,
    sme: req.params.smeId,
    description: req.body.description
  });

  await interest.save();

  res.status(201).send({ status: 'success', data: interest });
};

// Delete an sme:
// It also use to indicate that a funder is nolonger  unterested any this feature will be changed moved later
exports.destroyInterest = async (req, res) => {
  // check if the funder is deleting the sme he funded

  // then find and finally delete the funders interest on the sme
};


exports.updateInterest = async (req, res) => {
  // to be done
};
