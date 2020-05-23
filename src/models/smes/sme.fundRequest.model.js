const mongoose = require('mongoose');
const moment = require('moment');


// fundRequest schema
const fundRequestSchema = new mongoose.Schema({
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  },
  milestone: {
    type: String, required: true, minlength: 5, maxlength: 150
  },
  description: {
    type: String, minlength: 10, maxlength: 300
  },
  amount: { type: Number, required: true, default: 0 }
}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
fundRequestSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // these does not need to be returned on response
  }
});

const FundRequest = mongoose.model('FundRequest', fundRequestSchema);

exports.FundRequest = FundRequest;
