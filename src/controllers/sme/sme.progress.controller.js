/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Sme } = require('../../models/smes/sme.model');
const { Progress } = require('../../models/smes/sme.progress.model');


// retrieved a progress
exports.progressDetail = async (req, res) => {
  Progress.findById(req.params.id, (error, progress) => {
    if (error) return res.status(500).send({ status: 'error', message: error.message });
    if (!progress) return res.status(404).send({ status: 'error', message: 'Progress not found' });

    res.status(200).send({ status: 'success', data: progress });
  }).populate('sme');
};


// list all disbursement
exports.progressList = async (req, res) => {
  const progresses = await Progress.find();

  if (_.isEmpty(progresses)) return res.status(404).send({ status: 'error', message: 'No progress found' });

  res.status(200).send({ status: 'success', data: progresses });
};


// Create a progress
exports.createProgress = async (req, res) => {
  // validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  //  save sme progress
  const progress = new Progress({
    sme: sme._id,
    ...req.body
  });

  await progress.save();

  res.status(201).send({ status: 'success', data: progress });
};


// Delete a progress
exports.destroyProgress = async (req, res) => {
  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  const progress = await Progress.findByIdAndRemove(req.params.id);
  if (!progress) return res.status(404).send('Progress not found');

  res.status(200).send({ status: 'success', data: progress });
};


// Update  a progress
exports.updateProgress = async (req, res) => {
// validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  // validate progress
  const progress = await Progress.findById(req.params.id);
  if (!progress) return res.status(404).send({ status: 'error', message: 'Progress not found' });

  progress.title = req.body.title;
  progress.description = req.body.description;

  await progress.save();

  res.status(200).send({ status: 'success', data: progress });
};
