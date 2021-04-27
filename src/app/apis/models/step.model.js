const mongoose = require('mongoose');
const shortid = require('shortid');

const stepSchema = mongoose.Schema({
    _id: {  type: String,  default: shortid.generate},
    WI_Id: {type: String, required: true },
    Title: {type: String, required: true },
    Description: {type: String, required: false },
    Status: {type: String, required: false },
    Fields: {type: String, required: false },
    Attachment: {type: String, required: false },
    Instructions: {type: String, required: false },
    Warnings: {type: String, required: false },
    Hints: {type: String, required: false },
    isCloned: { type: Boolean, default: false },
    Reaction_Plan: {type: String, required: false },
    Published: { type: Boolean, default: false }
});

stepSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.StepId = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 
module.exports = mongoose.model('Step1', stepSchema);
