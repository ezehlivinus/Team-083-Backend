/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const moment = require('moment');
const { User } = require('../models/user.model');

// retrieve a user
exports.userDetail = async (req, res) => {
  try {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).send({ status: 'error', message: err.message });
      if (!user) return res.status(404).send({ status: 'error', message: 'No user found' });

      res.status(200).send({ status: 'Success', data: user });
    });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};


// list all users
exports.userList = async (req, res) => {
  const users = await User.find();

  if (_.isEmpty(users)) {
    return res.status(404).send({ status: 'error', message: 'No user found' });
  }

  res.status(200).send({ status: 'Success', data: users });
};


// create a user
exports.createUser = async (req, res) => {
  // validate req.body and return error message if any
  // to be done later

  // Check if user already registered, return message if true
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ status: 'error', message: 'User already registered' });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header('token', token).status(201).send({
    status: 'success',
    data: _.merge(user, { token })
  });
};


exports.updateUser = async (req, res) => {
  // TO BE DONE LATER: validate request body, show error if any

  // This does not currently handle password/change, a different handler be used for this

  // check if email exist in db
  const emailExist = await User.findOne({ email: req.body.email });

  const requestBody = _.omit(req.body, ['password', 'userType']);

  if (emailExist) {
    // omit email to avoid db.unique error
    const data = _.omit(requestBody, ['email']);

    await User.findByIdAndUpdate(req.params.id, { ...data }, { new: true }, async (error, user) => {
      if (error) return res.status(404).send('User not found');

      res.status(200).send({ status: 'success', data: user });
    });
  } else {
    await User.findByIdAndUpdate(req.params.id, {
      ...requestBody
    }, { new: true }, async (error, user) => {
      if (error) return res.status(404).send('User not found');

      res.status(200).send({ status: 'success', data: user });
    });
  }
};


// Delete a user
exports.destroyUser = async (req, res) => {
  // validate, only a user will delete itself, later admin will be given such privilege
  if (req.user._id !== req.params.id) return res.status(400).send('Bad request');

  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('User not found');

  res.status(200).send({ status: 'success', data: user });
};


// Login a user
exports.loginUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findOne({ email: req.body.email });

    if (_.isEmpty(user)) return res.status(400).send({ status: 'error', message: 'Invalid email  or password' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ status: 'error', message: 'Invalid password or email' });

    const token = user.generateAuthToken();

    res.header('token', token).status(201).send({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.send(error.message);
  }
};
