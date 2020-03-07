const mongoose = require('mongoose');
const validator = require('validator');


const statusCategorySchema = new mongoose.Schema({
    success: {
        type: String,
        required: true,
        trim: true,
        default: "success"
    },
    failed: {
        type: String,
        required: true,
        trim: true,
        default: "failed"
    },
    reject: {
        type: String,
        required: true,
        trim: true,
        default: "reject"
    },
    pending: {
        type: String,
        required: true,
        trim: true,
        default: "pending"
    }
}, {
    timestamps: true
});

// statusCategorySchema.methods.toJSON = function() {
//
//     const currencyCategory = this;
//     // toObject() allow to get raw object with user data and then manipulate with this data
//     const currencyCategoryObject = currencyCategory.toObject();
//
//     delete currencyCategoryObject._id;
//     delete currencyCategoryObject.createdAt;
//     delete currencyCategoryObject.updatedAt;
//     delete currencyCategoryObject.__v;
//
//     for (let i = 0; i < currencyCategoryObject.fiat.length; i++){
//         delete currencyCategoryObject.fiat[i]._id
//     }
//     for (let i = 0; i < currencyCategoryObject.crypto.length; i++){
//         delete currencyCategoryObject.crypto[i]._id
//     }
//
//     return currencyCategoryObject
// };


const StatusCategory = mongoose.model('StatusCategory', statusCategorySchema);

module.exports = { StatusCategory, statusCategorySchema };