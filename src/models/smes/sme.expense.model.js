const mongoose = require('mongoose');
const moment = require('moment');

// In the future we will be able to deduct expense from disbursement
// If sme spend more disbursement.amount - expense.amount will be in minus
// This will be redeemed next disbursement

// Describes sme expense
// expense schema
const expenseSchema = new mongoose.Schema({
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  },
  title: {
    type: String, required: true, minlength: 5, trim: true
  },
  description: {
    type: String, minlength: 5, trim: true
  },
  //   fund spend during this expense if any
  amount: {
    type: Number
  },
  // url to or any code/ref to this expense this can be on the description as well
  reference: {
    type: String
  }
}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
expenseSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // the field that should not be returned on response
    // delete ret.<the-field-here>;
  }
});


const Expense = mongoose.model('Expense', expenseSchema);

exports.Expense = Expense;
