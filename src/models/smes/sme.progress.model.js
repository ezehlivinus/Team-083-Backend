const mongoose = require('mongoose');
const moment = require('moment');

// Describes fund progress, after fund request
// progress schema
const progressSchema = new mongoose.Schema({
  sme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sme'
  },
  title: {
    type: String, required: true, minlength: 5
  },
  description: {
    type: String, required: true, minlength: 5
  }
}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
progressSchema.set('toJSON', {
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // the field that should not be returned on response
    // delete ret.<the-field-here>;
  }
});

const collectionName = 'progresses';

const Progress = mongoose.model('Progress', progressSchema, collectionName);

exports.Progress = Progress;
