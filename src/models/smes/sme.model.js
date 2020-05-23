const mongoose = require('mongoose');
const moment = require('moment');


// sme schema
const smeSchema = new mongoose.Schema({
  name: {
    type: String, required: true, minlength: 4, maxlength: 250
  },
  summary: {
    type: String, required: true, minlength: 10, maxlength: 200
  },
  logo: String,
  founders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  ask: { type: Number, required: true, default: 0 },
  // RC (may be means: Registered Company), is a business registration number
  rc: { type: Number, required: true, unique: true },
  isSuspended: {
    type: Boolean,
    required: true,
    default: false
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  // for now this is a simple self contained here array, to be extend to diff. schema later
  categories: [String]
}, { timestamps: { currentTime: () => moment().format() } });

// Tells which sme properties that are included when converting MongoDB records to
// JSON objects which are returned in API responses
smeSchema.set('toJSON', {
  virtuals: false, // includes the id
  versionKey: false, // excludes the __v
  transform(doc, ret) {
    // these does not need to be returned on response
    delete ret.isSuspended;
    delete ret.isVerified;
  }
});

const Sme = mongoose.model('Sme', smeSchema);

exports.Sme = Sme;

// adding new founders' logic that would be moved to or called in this model's controller.updateSme

// for new  founders (co-founder)
// if new founder was added on the request
// FIX: TO BE CONTINUED
//   if (!Array.isArray(req.body.founders)) return res.status(404).send('Founders id should be in array');
//   res.send('it is not empty and is');
//   if (!_.isEmpty(req.body.founders)) {
//     req.body.founders.forEach((founder) => {
//       // validate founder,
//       // in the future invitation would be send to unregistered user/founder, then sme.founders would be email/_id

//       const user = User.findById(founder);
//       if (user) {
//         sme.founders.push(founder);
//       }
//     });
//   }
