const mongoose = require('mongoose');
const shortid = require('shortid');

const UserSchema = mongoose.Schema({
  _id: {  type: String, default: shortid.generate},
    first_name: {type: String, required: true },
    last_name: {type: String, required: true },
    email: {type: String, required: true },
    password: {type: String, required: true },
    role: {type: String, required: true },
    empId: {type: String, required: true }
});
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
  });

module.exports = mongoose.model('User', UserSchema);