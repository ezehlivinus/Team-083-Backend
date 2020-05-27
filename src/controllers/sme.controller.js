/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const { Sme } = require('../models/smes/sme.model');
const { User } = require('../models/user.model');


// NOTE to define if a user has right to view detail/list smes
// that would be done later when smeProfile has been implemented,
// Then, all users can view smeProfile but not sme(or just basic sme account)


// retrieved an sme
exports.smeDetail = async (req, res) => {
  Sme.findById(req.params.id, (err, sme) => {
    if (err) return res.status(500).send({ status: 'error', message: err.message });
    if (!sme) return res.status(404).send({ status: 'error', message: 'No sme found' });

    res.status(200).send({ status: 'Success', data: sme });
  });
};


// list all smes
exports.smeList = async (req, res) => {
  const smes = await Sme.find();

  if (_.isEmpty(smes)) return res.status(404).send({ status: 'error', message: 'No user found' });

  res.status(200).send({ status: 'Success', data: smes });
};


// Create an sme
exports.createSme = async (req, res) => {
  // validate request body: to be done later

  // Check if this sme with the given rc number exist
  if (await Sme.findOne({ rc: req.body.rc })) {
    return res.status(400).send({
      status: 'error',
      message: `This SME with RC: ${req.body.rc} already registered`
    });
  }

  // validate user: for deleted users or (expired token: handle at middleware)
  const user = await User.findById(req.user._id);

  const message = {
    status: 'error',
    message: 'Bad request',
    hint: 'Try login-out and login again'
  };

  if (!user) return res.status(400).send(message);

  // these should not be set by users, except by admin/founders which will be treated later
  const sme = new Sme(_.omit(req.body, ['isVerified', 'isSuspended', 'founders']));

  sme.founders.push(req.user._id);

  await sme.save();

  res.status(201).send({ status: 'Success', data: sme });
};

// Delete an sme
exports.destroySme = async (req, res) => {
  const sme = await Sme.findByIdAndRemove(req.params.id);
  if (!sme) return res.status(404).send('Sme not found');
  res.status(200).send({ status: 'Success', data: sme });
};


exports.updateSme = async (req, res) => {
  // adding new founder has not been done yet but some snippet has been started,
  // check this sme model, some login was archived there for later use

  // omit these fields from the request's body
  const _smeData = _.omit(req.body, ['isVerified', 'isSuspended', 'founders']);

  await Sme.findByIdAndUpdate(req.params.id, _smeData,
    { new: true, useFindAndModify: false }, async (error, sme) => {
      if (error) return res.status(404).send('Sme not found');
      // who edits/updates should be one of the founders
      if (!sme.founders.includes(req.user._id)) return res.status(500).send('Bad request...Access denied');

      await sme.save();

      res.status(200).send({ status: 'Success', data: sme });
    });
};

// validates that this sme is in compliance with the system policy
exports.auditSme = async (req, res) => {
 
  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'sme  not found' });

  if (!sme.rc) return res.status(404).send({ status: 'error', message: 'Provide sme rc number' });

  // we are interested on this two field only
  sme.isVerified = req.body.isVerified;
  sme.isSuspended = req.body.isSuspended;
 
  await sme.save();

  res.status(200).send({ status: 'success', data: sme });
};
