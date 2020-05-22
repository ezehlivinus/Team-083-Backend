const mongoose = require('mongoose');
const moment = require('moment');


// funders interest schema
const interestSchema = new mongoose.Schema({
  funder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //   a funder can have interest in multiple smes, but as seperate record
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  },
  description: {
    type: String,
    required: true,
    trim: true,
    default: 'Please contact me'
  }
}, { timestamps: { currentTime: () => moment().format() } });


// Tells which user properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
interestSchema.set('toJSON', {
  versionKey: false // excludes the __v
});

const Interest = mongoose.model('Interest', interestSchema);

exports.FunderInterest = Interest;
