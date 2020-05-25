const mongoose = require('mongoose');
const moment = require('moment');


// funding schema
const fundingSchema = new mongoose.Schema({
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  },
  capital: {
    type: Number, required: true, min: 1
  },
  // describe how much remain after disbursement, later this feature will be moved as a full model
  // capital - disbursed.amount = balance
  balance: {
    type: Number, required: true
  },
  funder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  origin: {
    type: Boolean,
    required: true,
    default: true
  },
  _type: {
    type: String,
    enum: ['Grant', 'Equity', 'Founder Capital'],
    required: true,
    default: 'Grant'
  }
}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
fundingSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // the field that should not be returned on response
    // delete ret.<the-field-here>;
  }
});

const Funding = mongoose.model('Funding', fundingSchema);

exports.Funding = Funding;
