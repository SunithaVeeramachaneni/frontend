const mongoose = require('mongoose');
const shortid = require('shortid');

const CategorySchema = mongoose.Schema({
    _id: { type: String,  default: shortid.generate },  
    Category_Name: {type: String, required: true},
    Cover_Image: {type: String, required: true}
});


CategorySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.Category_Id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

module.exports = mongoose.model('Category1', CategorySchema);
