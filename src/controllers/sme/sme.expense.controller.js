/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const moment = require('moment');
const { Sme } = require('../../models/smes/sme.model');
const { Expense } = require('../../models/smes/sme.expense.model');

// retrieved a expense
exports.expenseDetail = async (req, res) => {
  // A logic would be made later here to restrict view to founders and funder

  Expense.findById(req.params.id, (error, expense) => {
    if (error) return res.status(500).send({ status: 'error', message: error.message });
    if (!expense) return res.status(404).send({ status: 'error', message: 'Expense not found' });

    res.status(200).send({ status: 'success', data: expense });
  }).populate('sme');
};


// list all expense
exports.expenseList = async (req, res) => {
  // A logic would be made later here to restrict view to founders and funder

  const expenses = await Expense.find();

  if (_.isEmpty(expenses)) return res.status(404).send({ status: 'error', message: 'No expense found' });

  res.status(200).send({ status: 'success', data: expenses });
};


// Create a expense
exports.createExpense = async (req, res) => {
  // validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  if (req.body.amount <= 0) return res.status(400).send({ status: 'error', message: 'amount too low' });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  //  save sme expense
  const expense = new Expense({
    sme: sme._id,
    ...req.body
  });

  await expense.save();

  res.status(201).send({ status: 'success', data: expense });
};


// Delete a expense
exports.destroyExpense = async (req, res) => {
  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  const expense = await Expense.findByIdAndRemove(req.params.id);
  if (!expense) return res.status(404).send('Expense not found');

  res.status(200).send({ status: 'success', data: expense });
};


// Update  a expense
exports.updateExpense = async (req, res) => {
// validate request body: to be done later, clean some code up

  // validate sme
  const sme = await Sme.findById(req.params.smeId);
  if (!sme) return res.status(404).send({ status: 'error', message: 'Sme not found' });
  if (!sme.isVerified && !sme.isSuspended) return res.status(404).send({ status: 'error', message: `Sme is not verified or is suspended ${sme.isSuspended}` });

  //   validate actor(user/founder)
  const notFounder = !sme.founders.includes(req.user._id);
  if (notFounder) return res.status(400).send({ status: 'error', message: `Access denied...you are not a founder of ${sme.name}` });

  // validate expense
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).send({ status: 'error', message: 'Expense not found' });


  expense.title = req.body.title;
  expense.description = req.body.description;
  expense.amount = req.body.amount;
  expense.reference = req.body.reference;
  expense.sme = sme._id;
  expense.updatedAt = moment().format();

  await expense.save();

  res.status(200).send({ status: 'success', data: expense });
};
