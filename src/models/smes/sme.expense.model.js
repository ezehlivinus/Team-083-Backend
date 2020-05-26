const mongoose = require('mongoose');
const moment = require('moment');

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
  amount: {
    type: Number
  },
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
