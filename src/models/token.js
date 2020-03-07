const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/default-config');


const tokenVerifySchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 21600 // after 6h
    }
});


const TokenVerify = mongoose.model('TokenVerify', tokenVerifySchema);

module.exports = {TokenVerify};