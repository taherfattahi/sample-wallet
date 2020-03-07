const mongoose = require('mongoose');
const validator = require('validator');


const cardCategorySchema = new mongoose.Schema({
    rialCard: {
        numberCard: {
            type: String,
            required: false,
            trim: true
        },
        numberShaba: {
            type: String,
            required: false,
            trim: true
        },
        accountName: {
            type: String,
            required: false,
            trim: true
        }
    },
    dollarCard: {
        numberCard: {
            type: String,
            required: false,
            trim: true
        },
        nameOwnerAccount: {
            type: String,
            required: false,
            trim: true
        },
        nameOfCountry: {
            type: String,
            required: false,
            trim: true
        }
    },
    bitCoinCard: {
        numberAccount: {
            type: String,
            required: false,
            trim: true
        }
    }
}, {
    timestamps: true
});

cardCategorySchema.methods.toJSON = function(){

    const cardCategory = this;
    // toObject() allow to get raw object with user data and then manipulate with this data
    const cardCategoryObject = cardCategory.toObject();

    delete cardCategoryObject._id;
    delete cardCategoryObject.createdAt;
    delete cardCategoryObject.updatedAt;
    delete cardCategoryObject.__v;
    // delete cardCategoryObject.category;

    // for (let i = 0; i < cardCategoryObject.categoryName.length; i++){
    //     delete cardCategoryObject.categoryName[i]._id
    // }

    // console.log(cardCategory)
    return cardCategoryObject
};


const CardCategory = mongoose.model('CardCategory', cardCategorySchema);

module.exports = { CardCategory, cardCategorySchema };