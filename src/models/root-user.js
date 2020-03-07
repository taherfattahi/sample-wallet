const mongoose = require('mongoose');
// const { packageSchema } = require('./package');
// const { categorySchema } = require('./category');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/default-config');


const userRootSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password: {
        type : String,
        required: true,
        unique : true,
        trim : true,
        lowercase : true,
        minlength : 6,
        validate (value) {
            //if (validator.contains(value.toLowerCase(), 'password')){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password can not contained "password"')
            }
        }
    },
    // categoryRootPackage: {
    //     type: categorySchema,
    //     required: false
    // },
    tokens : [{
        token : {
            type : String ,
            required : true
        }
    }],
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
    }
}, {
    timestamps: true
});

// userRootSchemaema.virtual('tasks', {
//     ref : 'Task',
//     localField : '_id',
//     foreignField : 'owner'
// });


// userSchema.plugin(uniqueValidator);

// statics method are accessible on a model
// userRootSchema.statics.findByCredential = async (email, password) => {
//     const user = await User.findOne({ email });
//     if (!user){
//         throw new Error( "Unable to login")
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//
//     if (!isMatch){
//         throw new Error( "Unable to login")
//     }
//     return user
// }



// in this example we should use this binding,
// for this reason we use async function not arrrow function
// methods are accessible on instance model

userRootSchema.methods.generateAuthToken = async function(){

    const root = this;
    // generate token
    try {
        // const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET);
        const token = jwt.sign({ _id : root._id.toString()}, JWT_SECRET);
        // add token to user model
        root.tokens = root.tokens.concat({ token });
        await root.save();
        return token
    } catch (e){
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
userRootSchema.pre('save', async function(next){
    // this give ccess to individual user
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    // if (user.isModified('phoneNumber')){
    //     user.tokens.token = await bcrypt.hash(user.password, 8)
    // }

    next()

});

// delete the tasks when user is removed

// userRootSchema.pre('remove', async function(next) {
//     const user = this
//     await Task.deleteMany({
//         owner : user._id
//     });
//
//     next()
// });

const UserRoot = mongoose.model('UserRoot', userRootSchema);

module.exports = UserRoot;