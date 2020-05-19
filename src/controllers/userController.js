/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const moment = require('moment');
const { User } = require('../models/user');
const UserType = require('../models/userType');

/**
 * Fetch a single user
 * GET: auth/users/:id
 */
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


/**
 * This fetch all users
 * GET: auth/users
 */
exports.userList = async (req, res) => {
  /**
   * @param none
   * @return {user} : a user object
   */
  const users = await User.find().select('-password -__v');

  if (_.isEmpty(users)) {
    return res.status(404).send({ status: 'error', message: 'No user found' });
  }

  res.status(200).send({ status: 'Success', data: users });
};


/**
 * Create a user
 * POST: auth/user
 */
exports.createUser = async (req, res) => {
  /**
   * @return {user} the created user and payload
   */

  // validate user data and return error message if any

  // Check if user already registered, return message if true
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ status: 'error', message: 'User already registered' });

  // Try registering the user
  try {
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // upon registration all user are of type user
    const userType = await UserType.find({ name: 'user' }).populate('userType');
    user.userType = userType.map((type) => type._id);

    await user.save();

    const token = user.generateAuthToken();
    user = _.omit(user._doc, ['password', '__v']);

    res.header('token', token).status(201).send({
      status: 'success',
      data: _.merge(user, { token })
    });
  } catch (error) {
    res.send(error.message);
  }
};


/**
 * Update user
 * PUT: /users/:id
 */
exports.updateUser = async (req, res) => {
  /**
   * @param id
   * @return {user}
   */

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


/**
 * Delete the user with the id
 * DELETE: auth/user/:id
 */
exports.destroyUser = async (req, res) => {
  /**
   * @param {id} user's id
   * @return {} user
   */
  try {
    const user = await User.findByIdAndRemove(req.params.id).select('-password -__v');
    if (!user) return res.status(404).send('User not found');
    res.status(200).send({ status: 'Success', data: user });
  } catch (error) {
    res.send(error.message);
  }
};
