const mongoose = require('mongoose');
// const { packageSchema } = require('./package');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/default-config');


// name: String,
//     email: { type: String, unique: true },
// roles: [{ type: 'String' }],
//     isVerified: { type: Boolean, default: false },
// password: String,
//     passwordResetToken: String,
//     passwordResetExpires: Date


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!!')
            }
        }
    },
    // phoneNumber: {
    //     type: String,
    //     required: false,
    //     unique: true,
    //     trim: true,
    //     validate(value) {
    //         if (!validator.isMobilePhone(value)) {
    //             throw new Error('Phone Number is invalid!!')
    //         }
    //     }
    // },
    token: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false,
        trim: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    familyName: {
        type: String,
        required: false,
        trim: true
    },
    nickName: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    imgCardLink: {
        type: String,
        required: false,
        trim: true
    },
    job: {
        type: String,
        required: false,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    ccapCoinId: {
        type: String,
        required: false,
        trim: true
    },
    baseCurrency: {
        type: String,
        required: false,
        trim: true
    },
    amountUserCcapCoin: {
        type: String,
        required: false,
        trim: true,
        default: 0
    },
    addUserCardId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'UserCard'
    },
    // addCard: {
    //     rialCard: {
    //         numberCard: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         numberShaba: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         accountName: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         isVerifiedRialCard: {
    //             type: String,
    //             required: false,
    //             trim: true,
    //             default: false
    //         }
    //     },
    //     dollarCard: {
    //         numberCard: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         nameOwnerAccount: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         nameOfCountry: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         isVerifiedDollarCard: {
    //             type: String,
    //             required: false,
    //             trim: true,
    //             default: false
    //         }
    //     },
    //     bitCoinCard: {
    //         numberAccount: {
    //             type: String,
    //             required: false,
    //             trim: true
    //         },
    //         isVerifiedBitCoinCard: {
    //             type: String,
    //             required: false,
    //             trim: true,
    //             default: false
    //         }
    //     }
    // },

    // currency: [
    //     {
    //         baseCurrency: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             required: false,
    //             ref: 'CurrencyCategory'
    //         },
    //         amount: {
    //             type: Number,
    //             default: false
    //         }
    //     }
    // ],
    // isVerified: [{
    //     isVerifiedEmail: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedName: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedFamilyName: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedCountry: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedCity: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedImgCardLink: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedJob: {
    //             type: Boolean,
    //             default: false
    //         },
    //     }, {
    //         isVerifiedDateOfBirth: {
    //             type: Boolean,
    //             default: false
    //         },
    //     },
    // ],
    isVerified: {
        type: Array,
        default: []
    },

    //     type : Array , "default" : [{
    //                     isVerifiedEmail: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },
    //                 {
    //                     isVerifiedName: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedFamilyName: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedCountry: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedCity: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedImgCardLink: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedJob: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 },{
    //                     isVerifiedDateOfBirth: {
    //                         type: Boolean,
    //                         default: false
    //                     },
    //                 }]
    // },
    // verified: [{
    //             isVerifiedEmail: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },
    //         {
    //             isVerifiedName: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedFamilyName: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedCountry: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedCity: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedImgCardLink: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedJob: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         },{
    //             isVerifiedDateOfBirth: {
    //                 type: Boolean,
    //                 default: false
    //             },
    //         }],
    //
    //


    // isVerifiedPhone: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedName: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedFamilyName: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedCountry: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedCity: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedImgCardLink: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedJob: {
    //     type: Boolean,
    //     default: false
    // },
    // isVerifiedDateOfBirth: {
    //     type: Boolean,
    //     default: false
    // },


    // passwordResetExpires: Date,
    // token: { type: String, required: true },
    // createdAt: { type: Date, required: true, default: Date.now, expires: 20 }
    // phoneNumber: {
    //     type : String,
    //     required: true,
    //     unique : true,
    //     trim: true,
    //     validate (value){
    //         if (!validator.isMobilePhone(value)){
    //             throw new Error('Phone Number is invalid!!')
    //         }
    //     }
    // },
    // tokens : [{
    //     token : {
    //         type : String ,
    //         required : true
    //     }
    // }],
    // packageBuy: [{
    //     packageId: {
    //         type: String,
    //         required: true
    //     },
    //     tokenExpire: {
    //         type : String,
    //         required : true
    //     },
    //     numberOfDownloadPackage: {
    //         type: Number,
    //         required: true
    //     },
    //     numberOfDownloadedPackage: {
    //         type: Number,
    //         required: true
    //     }
    // }]
});


// userSchema.plugin(uniqueValidator);

// statics method are accessible on a model  
// userSchema.statics.findByCredential = async (email, password) => {
//     const user = await User.findOne({ email });
//     if (!user){
//         throw new Error( "Unable to login")
//     }
//     const isMatch = await bcrypt.compare(password, user.password)
//
//     if (!isMatch){
//         throw new Error( "Unable to login")
//     }
//     return user
// }


// in this example we should use this binding,
// for this reason we use async function not arrrow function 
// methods are accessible on instance model 

userSchema.methods.generateAuthToken = async function () {

    const user = this;
    // generate token
    try {
        // const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET);
        const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET);
        // add token to user model
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token
    } catch (e) {
        throw new Error(e)
    }
};

// 
// userSchema.methods.toJSON = function(){
//
//     const user = this
//     // toObject() allow to get raw object with user data and then manipulate with this data
//     const userObject = user.toObject()
//
//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.avatar
//
//     //console.log(userObject)
//
//     return userObject
// }

// HASH the pålai text password before saving 
// pre - doing before action 
// post - doing after action 
// we are uising regular function due to the binding 
// next - continune move 
userSchema.pre('save', async function (next) {
    // this give ccess to individual user
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    // if (user.isModified('phoneNumber')){
    //     user.tokens.token = await bcrypt.hash(user.password, 8)
    // }

    next()

});


// userSchema.pre('findOneAndUpdate', async function (next) {
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
// });

// delete the tasks when user is removed 

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({
        owner: user._id
    });

    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;