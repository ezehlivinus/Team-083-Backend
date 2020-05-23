const mongoose = require('mongoose');
const moment = require('moment');


// smeAccount schema, defines financial account
const smeAccountSchema = new mongoose.Schema({
  sme: {
    type: String, required: true, minlength: 4, maxlength: 250
  },
  total: {
    type: String, required: true, minlength: 10, maxlength: 200
  },
  funder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
smeAccountSchema.set('toJSON', {
  versionKey: false // excludes the __v
});

const SmeAccount = mongoose.model('SmeAccount', smeAccountSchema);

exports.SmeAccount = SmeAccount;
