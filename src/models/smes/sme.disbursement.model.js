const mongoose = require('mongoose');
const moment = require('moment');


// disbursement schema
const disbursementSchema = new mongoose.Schema({
  funder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fundRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundRequest'
  },
  //   the sum that was disbursed
  amount: {
    type: Number, required: true
  },
  //   the sum that remain from the funding total, after amount has been disbursed
  // this must = funding.balance
  balance: {
    type: Number, required: true
  },
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  }

}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
disbursementSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // the field that should not be returned on response
    // delete ret.<the-field-here>;
  }
});

const Disbursement = mongoose.model('Disbursement', disbursementSchema);

exports.Disbursement = Disbursement;
