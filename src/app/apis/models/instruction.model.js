const mongoose = require('mongoose');
const shortid = require('shortid');

const InstructionSchema = mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    WI_Id: { type: Number, required: false },
    Categories: {type: String, required: true },
    WI_Name: {type: String, required: true},
    WI_Desc: {type: String, required: false},
    Tools: {type: String, required: false},
    Equipements: {type: String, required: false},
    Locations: {type: String, required: false},
    IsFavorite: { type: Boolean, default: false },
    CreatedBy: {type: String, required: false},
    EditedBy: {type: String, required: false},
    AssignedObjects: {type: String, required: false},
    SpareParts: {type: String, required: false},
    SafetyKit: {type: String, required: false},
    created_at: { type: Date, default: Date.now },
    Published: { type: Boolean, default: false },
    IsPublishedTillSave: { type: Boolean, default: false },
    Cover_Image: {type: String, required: false},
    updated_at: { type: Date, default: Date.now }
});

InstructionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.Id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

module.exports = mongoose.model('Instruction1', InstructionSchema);
