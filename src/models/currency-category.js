const mongoose = require('mongoose');
const validator = require('validator');


const currencyCategorySchema = new mongoose.Schema({
    fiat: [{
        fiatCurrency: {
            type: String,
            required: true,
            trim: true
        }
    }],
    crypto: [{
        cryptoCurrency: {
            type: String,
            required: true,
            trim: true
        }
    }]
}, {
    timestamps: true
});

currencyCategorySchema.methods.toJSON = function() {

    const currencyCategory = this;
    // toObject() allow to get raw object with user data and then manipulate with this data
    const currencyCategoryObject = currencyCategory.toObject();

    delete currencyCategoryObject._id;
    delete currencyCategoryObject.createdAt;
    delete currencyCategoryObject.updatedAt;
    delete currencyCategoryObject.__v;

    for (let i = 0; i < currencyCategoryObject.fiat.length; i++){
        delete currencyCategoryObject.fiat[i]._id
    }
    for (let i = 0; i < currencyCategoryObject.crypto.length; i++){
        delete currencyCategoryObject.crypto[i]._id
    }

    return currencyCategoryObject
};


const CurrencyCategory = mongoose.model('CurrencyCategory', currencyCategorySchema);

module.exports = { CurrencyCategory, currencyCategorySchema };