/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const moment = require('moment');
const { User } = require('../models/user');
const UserType = require('../models/userType');


exports.userDetail = async (req, res) => {
  try {
    User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).send({ status: 'error', message: err.message });
      if (!user) return res.status(404).send({ status: 'error', message: 'No user found' });

      res.status(200).send({ status: 'Success', data: user });
    })
      .select('-password -__v');
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};


exports.userList = async (req, res) => {

  const users = await User.find().select('-password -__v');

  if (_.isEmpty(users)) {
    return res.status(404).send({ status: 'error', message: 'No user found' });
  }

  res.status(200).send({ status: 'Success', data: users });
};


exports.createUser = async (req, res) => {

  // validate user data and return error message if any

  // Check if user already registered, return message if true
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ status: 'error', message: 'User already registered' });

  // Try registering the user
  try {
    user = new User(_.pick(req.body, ['name', 'email', 'password'])).populate('userType');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // upon registration all user are of type user
    const userType = await UserType.find({ name: 'user' });
    user.userType = userType.map((type) => type._id);

    await user.save();

    const token = user.generateAuthToken();

    res.header('token', token).status(201).send({
      status: 'success',
      data: _.merge(user, { token })
    });
  } catch (error) {
    res.send(error.message);
  }
};


exports.updateUser = async (req, res) => {
  // TO BE DONE LATER: validate request body, show error if any

  try {
    // This does not currently handle password/change, a different handler be used for this

    // when email is same as previous unique db error: check if email exist
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
      await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name
      }, { new: true }, async (error, user) => {
        if (error) return res.status(404).send('User not found');

        user.updatedAt = moment().format();
        await user.save();

        res.status(200).send({ status: 'success', data: user });
      })
        .select('-password -__v');
    } else {
      await User.findByIdAndUpdate(req.params.id, {
        email: req.body.email,
        name: req.body.name
      }, { new: true }, async (error, user) => {
        if (error) return res.status(404).send('User not found');

        user.updatedAt = moment().format();
        await user.save();

        res.status(200).send({ status: 'success', data: user });
      })
        .select('-password -__v');
    }
  } catch (error) {
    res.send(error.message);
  }
};


// Delete a user
exports.destroyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id).select('-password -__v');
    if (!user) return res.status(404).send('User not found');
    res.status(200).send({ status: 'Success', data: user });
  } catch (error) {
    res.send(error.message);
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    // check if user exist
    const user = await User.findOne({ email: req.body.email }).populate('userType', '-__v');

    if (_.isEmpty(user)) return res.status(400).send({ status: 'error', message: 'Invalid email  or password' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ status: 'error', message: 'Invalid password or email' });

    const token = user.generateAuthToken();

    res.header('token', token).status(201).send({
      status: 'success',
      data: _.merge(user, { token })
    });
  } catch (error) {
    res.send(error.message);
  }
};
