// Model: User, describes a user
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('@hapi/joi');


// const validateUser = (user) => {
//   const schema = {
//     name: Joi.string().min(3).max(100).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(3).max(255).required()
//   };

//   return Joi.validate(user, schema);
// };


// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true, minlength: 3, maxlength: 40
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  userType: {
    type: String,
    lowercase: true,
    enum: ['user', 'founder', 'funder', 'admin'],
    required: true,
    default: 'user'
  }

}, { timestamps: { currentTime: () => moment().format() } });

userSchema.methods.generateAuthToken = function t() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, userType: this.userType }, process.env.JWT_KEY, { expiresIn: '24h' }
  );
  return token;
};

// Tells which user properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
userSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    delete ret.password; // remove password
  }
});

const User = mongoose.model('User', userSchema);

exports.User = User;
// exports.validate = validateUser;
