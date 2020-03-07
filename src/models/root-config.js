const mongoose = require('mongoose');
// const { packageSchema } = require('./package');
// const { categorySchema } = require('./category');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/default-config');


const rootConfigSchema = new mongoose.Schema({
    baseCurrencyCCapCoin:{
        type : String,
        required: false,
        unique : true,
        trim : true,
        lowercase : true,
        default: "1"
    },
    baseCurrencyRateToUSD: {
        type : String,
        required: true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    baseCurrencyRateInverseToUSD: {
        type : String,
        required: true,
        unique : true,
        trim : true,
        lowercase : true,
    }
}, {
    timestamps: true
});


// rootConfigSchema.methods.generateAuthToken = async function(){
//
//     const root = this;
//     // generate token
//     try {
//         // const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET);
//         const token = jwt.sign({ _id : root._id.toString()}, JWT_SECRET);
//         // add token to user model
//         root.tokens = root.tokens.concat({ token });
//         await root.save();
//         return token
//     } catch (e){
//         throw new Error(e)
//     }
//
// };


// rootConfigSchema.pre('save', async function(next){
//     // this give ccess to individual user
//     const user = this;
//
//     if (user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     // if (user.isModified('phoneNumber')){
//     //     user.tokens.token = await bcrypt.hash(user.password, 8)
//     // }
//
//     next()
//
// });

// delete the tasks when user is removed

// userRootSchema.pre('remove', async function(next) {
//     const user = this
//     await Task.deleteMany({
//         owner : user._id
//     });
//
//     next()
// });

const RootConfig = mongoose.model('RootConfig', rootConfigSchema);

module.exports = RootConfig;