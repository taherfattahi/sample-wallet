const mongoose = require('mongoose');
const validator = require('validator');


const userMoneySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    userMoney: {
        // userId: {
        //     type: String,
        //     required: false,
        //     trim: true
        // },
        deposit: {
            currencyDeposit: {
                type: String,
                required: false,
                trim: true
            },
            amountDeposit: {
                type: String,
                required: false,
                trim: true
            },
            status: {
                type: String,
                required: true,
                trim: true,
                default: "pending"
            },
            operator: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            createdAt: {
                type: Date,
                // default: Date.now
                default: new Date().toISOString()
            }
        },
        donateTo: {
            ccapCoinIdDonateTo: {
                type: String,
                required: false,
                trim: true
            },
            // baseCurrencyDonate: {
            //     type: String,
            //     required: false,
            //     trim: true
            // },
            amountDonate: {
                type: String,
                required: false,
                trim: true
            },
            descriptionDonate: {
                type: String,
                required: false,
                trim: true
            },
            status: {
                type: String,
                required: true,
                trim: true,
                default: "failed"
            },
            operator: {
                type: String,
                required: false,
                trim: true,
                default: ""
            },
            createdAt: {
                type: Date,
                // default: Date.now
                default: new Date().toISOString()
            }
        },
        cashOut: [{
            chooseCardCash: {
                type: String,
                required: false,
                trim: true
            },
            userCardId: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: 'UserCard'
            },
            amountCash: {
                type: String,
                required: false,
                trim: true
            },
            createdAt: {
                type: Date,
                // default: Date.now
                default: new Date().toISOString()
            }
        }]
    }
}, {
    timestamps: true
});


userMoneySchema.methods.toJSON = function () {

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


const UserMoney = mongoose.model('UserMoney', userMoneySchema);

module.exports = {UserMoney, userMoneySchema};