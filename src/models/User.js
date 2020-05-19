// Model: User, describes a user
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
    type: String, required: true, unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserType'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function t() {
  const token = jwt.sign({ _id: this._id, email: this.email, userType: this.userType }, process.env.JWT_KEY);
  return token;
};


const User = mongoose.model('User', userSchema);

exports.User = User;
// exports.validate = validateUser;
