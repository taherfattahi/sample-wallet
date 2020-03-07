const express = require('express');
// const {Package} = require('../models/package');
// const {CategoryPackage} = require('../models/category');
// const {Slide} = require('../models/slide');
// const {Advertisement} = require('../models/advertisement');
// const {ExpireDate} = require('../models/expire-date');
// const {MasterPanel} = require('../models/master-panel');
const upload = require('../utils/multer-dest');
// const bodyParser = require('body-parser');
// const Test = require('../models/test');
const path = require('path');
const router = new express.Router();
const fs = require('fs');
const fsExtra = require('fs-extra');
// const multer = require('multer');
// const sharp = require('sharp');
// const getStream = require('get-stream/index');


const jwt = require('jsonwebtoken');
const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const cheerio = require('cheerio');
const axios = require('axios');

const {JWT_SECRET, MY_NAMESPACE, MY_NAMESPACE1} = require('../config/default-config');
const {smtpTransport} = require('../utils/nodemailer-util');
const {checkUserLogin, checkRootLogin, checkPreUploadImgCard, checkPreUpdate} = require('../middleware/checkAuthLogin');
const User = require('../models/user');
const RootUser = require('../models/root-user');
const {TokenVerify} = require('../models/token');
const {CurrencyCategory} = require('../models/currency-category');
const {CardCategory} = require('../models/card-category');
const {StatusCategory} = require('../models/status-category');
const RootConfig = require('../models/root-config');
const {UserCard} = require('../models/user-card');
const {UserMoney} = require('../models/user-money');

let host = "";
let hostpassword = "";
// const uuidv4 = require('uuid/v4');
// console.log(uuidv4());


// let t = "";
// let txt = "";
fetch = async () => {

    const page = await axios.get('http://www.tgju.org');

    const $ = cheerio.load(page.data);
    let txt = $('html').attr('data-revision');
    let dt = $('#server-time').attr('data-server');

    let time_clock, time_clock_fn_d = 0;
    let datetime_date = dt.split(' ')[0].split('-');
    let datetime_time = dt.split(' ')[1].split(':');
    let datetime_full = new Date(Date.UTC(datetime_date[0], datetime_date[1], datetime_date[2], datetime_time[0], datetime_time[1], datetime_time[2]));
    // setInterval(async function () {
    if (!time_clock_fn_d || time_clock_fn_d === 0)
        time_clock_fn_d = datetime_full;
    time_clock_fn_d.setSeconds(time_clock_fn_d.getSeconds() + 1);
    let result = time_clock_fn_d.getFullYear() + '-' + (time_clock_fn_d.getMonth() < 10 ? ('0' + time_clock_fn_d.getMonth()) : time_clock_fn_d.getMonth()) + '-' + (time_clock_fn_d.getDate() < 10 ? ('0' + time_clock_fn_d.getDate()) : time_clock_fn_d.getDate()) + ' ' + (time_clock_fn_d.getHours() < 10 ? ('0' + time_clock_fn_d.getHours()) : time_clock_fn_d.getHours()) + ':' + (time_clock_fn_d.getMinutes() < 10 ? ('0' + time_clock_fn_d.getMinutes()) : time_clock_fn_d.getMinutes()) + ':' + (time_clock_fn_d.getSeconds() < 10 ? ('0' + time_clock_fn_d.getSeconds()) : time_clock_fn_d.getSeconds());


    let t = result;


    if (t && txt) {
        t = t.replace(/-/g, "");
        t = t.replace(/:/g, "");
        t = t.replace(/ /g, "");

        const page1 = await axios.get('http://call5.tgju.org/ajax.json?' + txt + "-" + t + "-" + "asd");
        // console.log("price_dollar_rl: " + page1.data.current.price_dollar_rl.p);
        // console.log("crypto-bitcoin: " + page1.data.current['crypto-bitcoin'].p);
        return (page1.data.current.price_dollar_rl.p + "::" + page1.data.current['crypto-bitcoin'].p).split("::")
    }

    return undefined;

    // console.log(t)

    // }, 1000);


};


// fetchApi = async () => {
//
//     // setInterval(async () => {
//
//         // console.log(t);
//
//         if (t && txt){
//             t = t.replace(/-/g, "");
//             t = t.replace(/:/g, "");
//             t = t.replace(/ /g, "");
//
//             const page1 = await axios.get('http://call5.tgju.org/ajax.json?' + txt + "-" + t + "-" + "asd");
//             console.log("price_dollar_rl: " + page1.data.current.price_dollar_rl.p);
//             console.log("crypto-bitcoin: " + page1.data.current['crypto-bitcoin'].p);
//         }
//
//     // }, 1000);
//
// };

function roundUsing(func, number, prec) {
    let tempnumber = number * Math.pow(10, prec);
    tempnumber = func(tempnumber);
    return tempnumber / Math.pow(10, prec);
}


router.post('/createrootuser', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdatesArray = ['name', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    const rootUser = new RootUser(req.body);

    try {
        await rootUser.save();
        // sendWelcomeEmail(user.email, user.name)
        const token = await rootUser.generateAuthToken();
        //console.log(user)
        res.status(201).send({rootUser, token});
    } catch (e) {
        res.status(400).send(e)
    }

});


router.post('/createuser', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdatesArray0 = ['email'];
    // const allowedUpdatesArray1 = ['phoneNumber'];
    // const isValidOperation = updates.every((update) =>
    //     allowedUpdatesArray0.includes(update) || allowedUpdatesArray1.includes(update));
    const isValidOperation = updates.every((update) => allowedUpdatesArray0.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    // let reqBody = req.body.email ? req.body.email : req.body.phoneNumber;
    let reqBody = req.body.email;

    // console.log(uid);
    // console.log(MY_NAMESPACE);
    // const token = jwt.sign({ _id : "test"}, JWT_SECRET);
    // console.log(token)

    try {

        let userObject = new User();
        // if (req.body.email) {
        userObject.email = reqBody;
        // } else {
        //     userObject.phoneNumber = reqBody;
        // }

        // userObject.isVerified[0] = {
        //     isVerifiedEmail: false,
        //     isVerifiedName: false,
        //     isVerifiedFamilyName: false,
        //     isVerifiedCountry: false,
        //     isVerifiedCity: false,
        //     isVerifiedImgCardLink: false,
        //     isVerifiedJob: false,
        //     isVerifiedDateOfBirth: false
        // };

        userObject.isVerified = [{
            isVerifiedEmail: false
        }, {
            isVerifiedPhoneNumber: false
        }, {
            isVerifiedName: false
        }, {
            isVerifiedFamilyName: false
        }, {
            isVerifiedCountry: false
        }, {
            isVerifiedCity: false
        }, {
            isVerifiedImgCardLink: false
        }, {
            isVerifiedJob: false
        }, {
            isVerifiedDateOfBirth: false
        }];

        // userObject.currency = await CurrencyCategory.find({});

        let saveUser;
        try {
            saveUser = await userObject.save();
        } catch (e) {
            // console.log(e)
            if (e.errmsg.includes("duplicate key error")) {
                const duplicateUser = await User.findOne(req.body.email ? {email: req.body.email} : {phoneNumber: req.body.phoneNumber});
                if (!duplicateUser) {
                    return res.status(403).send({error: "duplicate key error"});
                }

                if (!duplicateUser.isVerified[0].isVerifiedEmail) {

                    const duplicateToken = await TokenVerify.findOne({_userId: duplicateUser._id.toString()});

                    if (!duplicateToken) {

                        const uid = uuidv5(duplicateUser._id.toString(), MY_NAMESPACE);

                        host = req.get('host');
                        let link = "http://" + host + "/verifyemail?id=" + uid;
                        let mailOptions = {
                            // to : req.query.to,
                            // to: "taherfattahi11@gmail.com",
                            to: req.body.email,
                            subject: "Please confirm your Email account",
                            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                        };
                        console.log(mailOptions);
                        smtpTransport.sendMail(mailOptions, async (error, response) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).send({error: error.message});
                            } else {
                                console.log("Message sent: " + JSON.stringify(response));

                                let tokenObject = new TokenVerify();
                                tokenObject._userId = duplicateUser;
                                tokenObject.token = uid;
                                await tokenObject.save();

                                // res.end("sent");
                                return res.status(200).send({sent: "success sent email"});
                            }
                        });

                    } else {
                        return res.status(200).send({check: "please check your email and verify it"});
                    }

                } else {
                    res.status(403).send({error: "duplicate key error"});
                }
            }

            res.status(500).send({error: "error"});
        }

        const uid = uuidv5(saveUser._id.toString(), MY_NAMESPACE);

        // console.log(req.get('host'))
        host = req.get('host');
        let link = "http://" + host + "/verifyemail?id=" + uid;
        let mailOptions = {
            // to : req.query.to,
            // to: "taherfattahi11@gmail.com",
            to: req.body.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, async (error, response) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: error.message});
            } else {
                console.log("Message sent: " + JSON.stringify(response));


                let tokenObject = new TokenVerify();
                tokenObject._userId = userObject;
                tokenObject.token = uid;
                await tokenObject.save();


                // res.end("sent");
                res.status(500).send({sent: "success sent email"});
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({error: e.message});
    }

    // user.password = await bcrypt.hash(user.password, 8)

    // const user = new User(req.body);
    //
    // try {
    //     await user.save();
    //     // sendWelcomeEmail(user.email, user.name)
    //     const token = await user.generateAuthToken();
    //     //console.log(user)
    //     res.status(201).send({user, token});
    // } catch (e) {
    //     res.status(400).send({error: e.message})
    // }
    /*     user.save().then(() => {
            res.status(201).send(user)
        }).catch((e) => {

            res.status(400).send(e)
        }) */
});

router.get('/verifyemail', async (req, res) => {

    if (!req.query.id) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    // let tokenObj = await TokenVerify.findOne({token: req.query.id}).populate('_userId');
    // if (!tokenObj) {
    //     return res.status(404).send({notFound: "not Found User or Token is Expire"})
    // }
    // // console.log(tokenObj);
    // if (req.query.id == tokenObj.token) {
    //     // console.log(tokenObj)
    //     // console.log(tokenObj._userId._id.toString())
    //     const jsonToken = jwt.sign({_id: tokenObj._userId._id.toString()}, JWT_SECRET);
    //     await User.findByIdAndUpdate(tokenObj._userId._id, {
    //         $set: {
    //             // 'isVerified.$.isVerifiedEmail':  true,
    //             // "isVerified.0.isVerifiedEmail": true,
    //             // "isVerified.$[].isVerifiedEmail": true,
    //             // "isVerified.$[].isVerifiedEmail":  true,
    //             token: jsonToken
    //         }
    //     }, { new: true});
    //
    // }
    // return


    // host = "localhost:3000";
    if ((req.protocol + "://" + req.get('host')) === ("http://" + host)) {
        // let tokenObj = await Token.findById({_id: "5df555342309bf19254dcba6"}).populate('_userId');
        let tokenObj = await TokenVerify.findOne({token: req.query.id}).populate('_userId');
        if (!tokenObj) {
            return res.status(404).send({notFoundToken: "Token is Expire"})
        }
        // console.log(tokenObj);
        if (req.query.id == tokenObj.token) {
            // console.log(tokenObj)
            // console.log(tokenObj._userId._id.toString())
            const jsonToken = jwt.sign({_id: tokenObj._userId._id.toString()}, JWT_SECRET);
            await User.findByIdAndUpdate(tokenObj._userId._id, {
                $set: {
                    // 'isVerified.$.isVerifiedEmail':  true,
                    "isVerified.0.isVerifiedEmail": true,
                    // "isVerified.$[].isVerifiedEmail": true,
                    // "isVerified.$[]": {isVerifiedEmail:true},
                    token: jsonToken,
                    ccapCoinId: uuidv5(tokenObj._userId._id.toString(), MY_NAMESPACE1)
                }
            }, {new: true});
            await TokenVerify.findByIdAndRemove(tokenObj._id);
            console.log("email is verified");

            // res.end("<h1>Email is been Successfully verified");
            res.status(200).send({verified: "email is verified"});
        } else {
            console.log("email is not verified");
            // res.end("<h1>Bad Request</h1>");
            res.status(400).send({notVerified: "email is not verified"});
        }
    } else {
        // res.end("<h1>Request is from unknown source");
        res.status(400).send({unknownSource: "Request is from unknown source"});
    }

});

//todo
router.post('/verifyemailprofile', checkUserLogin, async (req, res) => {

});
router.post('/verifyphoneprofile', checkUserLogin, async (req, res) => {

});


router.post('/forgotpassword', async (req, res) => {

    // try {

    // if (!req.query.id) {
    //     return res.status(400).send({error: 'Invalid Request Body'})
    // }

    const updates = Object.keys(req.body);
    const allowedUpdatesArray0 = ['email'];
    const isValidOperation = updates.every((update) =>
        allowedUpdatesArray0.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.status(404).send({notFound: "not found user"});
    }

    await TokenVerify.findOneAndRemove({_userId: user._id.toString()});
    // if (!duplicateToken) {
    //     await duplicateToken.remove();
    //
    // }

    if (!user.isVerified[0].isVerifiedEmail) {
        // return res.status(401).send({unauthorized: "please first verify your email"});
        // if (!duplicateToken) {

        const uid = uuidv5(use._id.toString(), MY_NAMESPACE);

        let tokenObject = new TokenVerify();
        tokenObject._userId = user;
        tokenObject.token = uid;
        await tokenObject.save();

        hostpassword = req.get('host');
        let link = "http://" + hostpassword + "/verifypassword?id=" + uid;
        let mailOptions = {
            // to : req.query.to,
            to: "taherfattahi11@gmail.com",
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.status(500).send({error: "error"});
            } else {
                console.log("Message sent: " + JSON.stringify(response));
                // res.end("sent");
                res.status(200).send({sent: "success sent email"});
            }
        });

        return
        // }
    }

    const uid = uuidv5(user._id.toString(), MY_NAMESPACE);

    let tokenObject = new TokenVerify();
    tokenObject._userId = user;
    tokenObject.token = uid;
    await tokenObject.save();

    hostpassword = req.get('host');
    let link = "http://" + hostpassword + "/verifypassword?id=" + uid;
    let mailOptions = {
        // to : req.query.to,
        to: "taherfattahi11@gmail.com",
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.status(500).send({error: "error"});
        } else {
            console.log("Message sent: " + JSON.stringify(response));
            // res.end("sent");
            res.status(200).send({sent: "success sent email"});
        }
    });

    // } catch (e) {
    //     res.status(400).send(e);
    // }

});

router.get('/verifypassword', async (req, res) => {

    try {

        if (!req.query.id) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        // host = "localhost:3000";
        if ((req.protocol + "://" + req.get('host')) === ("http://" + hostpassword)) {
            // let tokenObj = await Token.findById({_id: "5df555342309bf19254dcba6"}).populate('_userId');
            let tokenObj = await TokenVerify.findOne({token: req.query.id}).populate('_userId');
            if (!tokenObj) {
                return res.status(404).send({notFoundToken: "Token is Expire"})
            }
            // console.log(tokenObj);
            if (req.query.id === tokenObj.token) {
                // const jsonToken = jwt.sign({_id: tokenObj._userId._id.toString()}, JWT_SECRET);
                // await User.findByIdAndUpdate(tokenObj._userId._id, {
                //     $set: {
                //         // 'isVerified.$.isVerifiedEmail':  true,
                //         "isVerified.0.isVerifiedEmail": true,
                //         // "isVerified.$[].isVerifiedEmail": true,
                //         // "isVerified.$[]": {isVerifiedEmail:true},
                //         token: jsonToken
                //     }
                // }, {new: true});
                // const tokenResetObj = new TokenVerify();
                // tokenResetObj._userId = uuidv4();

                tokenObj.resetPasswordToken = uuidv4();
                tokenObj.save();

                // await TokenVerify.findByIdAndRemove(tokenObj._id);
                // console.log("password is changed");
                // res.end("<h1>Email is been Successfully verified");
                res.status(200).send({
                    changePasswordPage: "page password changed",
                    resetTokenPassword: tokenObj.resetPasswordToken
                });
            } else {
                console.log("change password is not verified");
                // res.end("<h1>Bad Request</h1>");
                res.status(400).send({notVerified: "change password is not verified"});
            }
        } else {
            // res.end("<h1>Request is from unknown source");
            res.status(400).send({unknownSource: "Request is from unknown source"});
        }
    } catch (e) {
        res.status(400).send(e);
    }

});

router.post('/verifypassword', async (req, res) => {

    // if (!req.query.id) {
    //     return res.status(400).send({error: 'Invalid Request Body'})
    // }

    try {

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['password', 'retypepassword', 'id'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        if (req.body.password !== req.body.retypepassword) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const tokenObj = await TokenVerify.findOne({resetPasswordToken: req.body.id}).populate('_userId');
        // console.log(tokenObj)

        if (!tokenObj) {
            return res.status(404).send({notFoundToken: "Token is Expire"})
        } else {
            await User.findByIdAndUpdate(tokenObj._userId._id, {
                $set: {
                    // 'isVerified.$.isVerifiedEmail':  true,
                    "password": await bcrypt.hash(req.body.password, 8),
                    // "isVerified.$[].isVerifiedEmail": true,
                    // "isVerified.$[]": {isVerifiedEmail:true},
                }
            }, {new: true});
            await TokenVerify.findByIdAndRemove(tokenObj._id);
            console.log("success change password");
            // res.end("<h1>Email is been Successfully verified");
            res.status(200).send({successChangePassword: "success change password"});
        }

    } catch (e) {
        res.status(400).send(e);
    }

});

router.post('/createCurrencyCategory', checkRootLogin, async (req, res) => {

    try {

        console.log(req.body);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['fiat', 'crypto'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }
        console.log(req.body.crypto.length);

        if (req.body.fiat.length === 0 && req.body.crypto.length === 0) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const updates1 = Object.keys(req.body.fiat[0]);
        const updates2 = Object.keys(req.body.crypto[0]);
        const allowedUpdatesArray1 = ['fiatCurrency', 'cryptoCurrency'];

        const isValidOperation1 = updates1.every((update) =>
            allowedUpdatesArray1.includes(update));

        const isValidOperation2 = updates2.every((update) =>
            allowedUpdatesArray1.includes(update));

        if (!isValidOperation1 && !isValidOperation2) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        let currencyCategoryObj = new CurrencyCategory(req.body);

        const find = await CurrencyCategory.find({});
        if (find.length === 0) {
            // for (let i = 0; i < req.body.fiat.length; i++) {
            //     currencyCategoryObj.fiat[i] = {fiatCurrency: req.body.fiat[i].fiatCurrency};
            // }
            // for (let j = 0; j < req.body.crypto.length; j++) {
            //     currencyCategoryObj.crypto[j] = {cryptoCurrency: req.body.crypto[j].cryptoCurrency};
            // }
            await currencyCategoryObj.save();

        } else {
            let productToUpdate = {};
            productToUpdate = Object.assign(productToUpdate, currencyCategoryObj._doc);
            delete productToUpdate._id;
            await CurrencyCategory.updateMany({}, {$set: productToUpdate});
        }

        res.status(201).send({"Success": "update or create new currency category"});

    } catch (e) {
        res.status(400).send(e);
    }

});

router.get('/getCurrencyCategory', async (req, res) => {
    try {
        const findCurrencyCategory = await CurrencyCategory.find({});

        res.status(200).send(findCurrencyCategory[0]);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

router.post('/completeprofile', checkUserLogin, checkPreUploadImgCard, async (req, res) => {

    // try {
    // console.log(req.body);
    // console.log(req.user);

    // console.log(req.files);
    // console.log(req);
    // console.log(req.body);


    // const userObj = new User();
    // userObj

    // const userObj = new User();

    // console.log(req.user.isVerified);

    // if (!req.user.isVerified[0].isVerifiedEmail){
    //     req.user.email = req.body.email;
    // }

    if (!req.user.isVerified[1].isVerifiedName) {
        req.user.name = req.body.name;
    }
    if (!req.user.isVerified[2].isVerifiedFamilyName) {
        req.user.familyName = req.body.familyName;
    }
    if (!req.user.isVerified[3].country) {
        req.user.country = req.body.country;
    }
    if (!req.user.isVerified[4].isVerifiedCity) {
        req.user.city = req.body.city;
    }
    if (!req.user.isVerified[6].isVerifiedJob) {
        req.user.job = req.body.job;
    }
    if (!req.user.isVerified[7].isVerifiedDateOfBirth) {
        req.user.dateOfBirth = req.body.dateOfBirth;
    }

    req.user.nickName = req.body.nickName;
    req.user.baseCurrency = req.body.baseCurrency;

    // req.user.phoneNumber = req.body.phoneNumber;
    // req.user.password = req.body.password;
    // req.user.familyName = req.body.familyName;
    // req.user.nickName = req.body.nickName;
    // req.user.country = req.body.country;
    // req.user.city = req.body.city;
    // req.user.job = req.body.job;
    // req.user.dateOfBirth = req.body.dateOfBirth;

    // console.log(req.body.ccapCoinId)
    // console.log(uid)
    // console.log(req.user.ccapCoinId)
    if (!req.user.ccapCoinId) {
        req.user.ccapCoinId = uuidv5(req.user._id.toString(), MY_NAMESPACE1);
    }

    await req.user.save();

    res.status(200).send({completeProfile: "Success Fill Profile"});

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});


router.post('/addusercard', checkUserLogin, async (req, res) => {

    try {

        console.log(req.user);
        // console.log(req.body);
        // console.log(req.body.hasOwnProperty('rialCard'));

        const userCardObj = new UserCard();

        if (req.body.hasOwnProperty('rialCard')) {
            const updates = Object.keys(req.body.rialCard);

            const allowedUpdatesArray = ['numberCard', 'numberShaba', 'accountName'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            userCardObj.rialCard.numberCard = req.body.rialCard.numberCard;
            userCardObj.rialCard.numberShaba = req.body.rialCard.numberShaba;
            userCardObj.rialCard.accountName = req.body.rialCard.accountName;

            if (!!req.user.addUserCardId.rialCard.isVerifiedRialCard) {

                let productToUpdate = {};
                productToUpdate = Object.assign(productToUpdate, userCardObj._doc);
                delete productToUpdate._id;

                // console.log(productToUpdate);
                // console.log(req.user._id)
                await UserCard.findByIdAndUpdate(req.user.addUserCardId._id, {rialCard: productToUpdate.rialCard}, {new: true});

                return res.status(200).send({success: 'your card is updated'})
            }

        } else if (req.body.hasOwnProperty('dollarCard')) {
            const updates = Object.keys(req.body.dollarCard);

            const allowedUpdatesArray = ['numberCard', 'nameOwnerAccount', 'nameOfCountry'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            userCardObj.dollarCard.numberCard = req.body.dollarCard.numberCard;
            userCardObj.dollarCard.nameOwnerAccount = req.body.dollarCard.nameOwnerAccount;
            userCardObj.dollarCard.nameOfCountry = req.body.dollarCard.nameOfCountry;

            if (!!req.user.addUserCardId.dollarCard.isVerifiedDollarCard) {
                let productToUpdate = {};
                productToUpdate = Object.assign(productToUpdate, userCardObj._doc);
                delete productToUpdate._id;

                await UserCard.findByIdAndUpdate(req.user.addUserCardId, {dollarCard: productToUpdate.dollarCard}, {new: true});

                return res.status(200).send({success: 'your card is updated'})
            }

        } else if (req.body.hasOwnProperty('bitCoinCard')) {
            const updates = Object.keys(req.body.bitCoinCard);

            const allowedUpdatesArray = ['numberAccount'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            userCardObj.bitCoinCard.numberAccount = req.body.bitCoinCard.numberAccount;

            if (req.user.addUserCardId.bitCoinCard) {
                let productToUpdate = {};
                productToUpdate = Object.assign(productToUpdate, userCardObj._doc);
                delete productToUpdate._id;

                await UserCard.findByIdAndUpdate(req.user.addUserCardId, {bitCoinCard: productToUpdate.bitCoinCard}, {new: true});

                return res.status(200).send({success: 'your card is updated'})
            }
        }

        if (!req.user.addUserCardId) {
            await userCardObj.save();
            req.user.addUserCardId = userCardObj;
            await req.user.save();

            res.status(200).send({success: 'success add card'})
        }

        // res.setHeader('Content-Type', 'text/html');
        // res.setHeader('Content-Type', 'text/plain');
        res.status(200).send({success: 'your card is up to date'})


    } catch (e) {
        res.status(400).send({error: e.message});
    }

});


router.post('/rootcreatecard', checkRootLogin, async (req, res) => {

    try {

        const cardCategory = new CardCategory();

        if (req.body.hasOwnProperty('rialCard')) {
            const updates = Object.keys(req.body.rialCard);

            const allowedUpdatesArray = ['numberCard', 'numberShaba', 'accountName'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            cardCategory.rialCard.numberCard = req.body.rialCard.numberCard;
            cardCategory.rialCard.numberShaba = req.body.rialCard.numberShaba;
            cardCategory.rialCard.accountName = req.body.rialCard.accountName;
        }

        if (req.body.hasOwnProperty('dollarCard')) {
            const updates = Object.keys(req.body.dollarCard);

            const allowedUpdatesArray = ['numberCard', 'nameOwnerAccount', 'nameOfCountry'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            cardCategory.dollarCard.numberCard = req.body.dollarCard.numberCard;
            cardCategory.dollarCard.nameOwnerAccount = req.body.dollarCard.nameOwnerAccount;
            cardCategory.dollarCard.nameOfCountry = req.body.dollarCard.nameOfCountry;
        }

        if (req.body.hasOwnProperty('bitCoinCard')) {
            const updates = Object.keys(req.body.bitCoinCard);

            const allowedUpdatesArray = ['numberAccount'];

            const isValidOperation = updates.every((update) =>
                allowedUpdatesArray.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({error: 'Invalid Request Body'})
            }

            cardCategory.bitCoinCard.numberAccount = req.body.bitCoinCard.numberAccount;
        }

        const find = await CardCategory.find({});
        if (find.length === 0) {
            await cardCategory.save();
        } else {
            let productToUpdate = {};
            productToUpdate = Object.assign(productToUpdate, cardCategory._doc);
            delete productToUpdate._id;

            await CardCategory.updateMany({}, {$set: productToUpdate});
        }

        res.status(200).send({success: 'success add card from root user'})

    } catch (e) {
        res.status(400).send({error: e.message});
    }

});

router.post('/rootconfig', checkRootLogin, async (req, res) => {

    try {


        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['baseCurrencyCCapCoin', 'baseCurrencyRateToUSD', 'baseCurrencyRateInverseToUSD'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        let rootConfig = new RootConfig();

        rootConfig.baseCurrencyCCapCoin = req.body.baseCurrencyCCapCoin;
        rootConfig.baseCurrencyRateToUSD = req.body.baseCurrencyRateToUSD;
        rootConfig.baseCurrencyRateInverseToUSD = req.body.baseCurrencyRateInverseToUSD;

        const find = await RootConfig.find({});
        if (find.length === 0) {
            await rootConfig.save();
        } else {
            let productToUpdate = {};
            productToUpdate = Object.assign(productToUpdate, rootConfig._doc);
            delete productToUpdate._id;

            await RootConfig.updateMany({}, {$set: productToUpdate});
        }

        res.status(200).send({success: 'success add root config'})

    } catch (e) {
        res.status(400).send({error: e.message});
    }

});

router.post('/rootstatuscategory', checkRootLogin, async (req, res) => {
    try {

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['success', 'failed', 'reject', 'pending'];

        const isValidOperation = updates.every((update) => allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        let rootStatusConfig = new StatusCategory();

        rootStatusConfig.success = req.body.success;
        rootStatusConfig.failed = req.body.failed;
        rootStatusConfig.reject = req.body.reject;
        rootStatusConfig.pending = req.body.pending;

        const find = await StatusCategory.find({});
        if (find.length === 0) {
            await rootStatusConfig.save();
        } else {
            let productToUpdate = {};
            productToUpdate = Object.assign(productToUpdate, rootStatusConfig._doc);
            delete productToUpdate._id;

            await StatusCategory.updateMany({}, {$set: productToUpdate});
        }

        res.status(200).send({success: 'success add root status'})

    } catch (e) {
        res.status(400).send({error: e.message});
    }
});


router.get('/getcard', async (req, res) => {
    try {
        const findCardCategory = await CardCategory.find({});

        res.status(200).send(findCardCategory[0]);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});


router.post('/depositMoney', checkUserLogin, async (req, res) => {

    try {

        console.log(req.body);
        console.log(req.user);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['currencyDeposit', 'amountDeposit'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const currentRate = await fetch();
        const baseRate = await RootConfig.find({});
        const statusCategory = await StatusCategory.find({});

        console.log(currentRate);
        console.log(baseRate);
        console.log(statusCategory);

        const userMoney = new UserMoney();

        switch (req.body.currencyDeposit) {

            case "rial":

                let amountCcapCoinRial = parseFloat(req.body.amountDeposit) * (1 / parseFloat(currentRate[0])) * parseFloat(baseRate[0].baseCurrencyRateInverseToUSD);

                amountCcapCoinRial = roundUsing(Math.floor, amountCcapCoinRial, 8);

                userMoney.userId = req.user;
                userMoney.userMoney.deposit = {
                    "currencyDeposit": "rial",
                    "amountDeposit": amountCcapCoinRial,
                    "status": statusCategory[0].pending
                };

                await userMoney.save();

                console.log(amountCcapCoinRial);

                // req.user.amountUserCcapCoin = parseFloat(req.user.amountUserCcapCoin) + amountCcapCoinRial;
                // await req.user.save();

                return res.status(201).send({success: 'success rial deposit'});

            case "dollar":

                let amountCcapCoinDollar = parseFloat(req.body.amountDeposit) * parseFloat(baseRate[0].baseCurrencyRateInverseToUSD);

                amountCcapCoinDollar = roundUsing(Math.floor, amountCcapCoinDollar, 8);

                userMoney.userId = req.user;
                userMoney.userMoney.deposit = {
                    "currencyDeposit": "dollar",
                    "amountDeposit": amountCcapCoinDollar,
                    "status": statusCategory[0].pending
                };

                await userMoney.save();

                console.log(amountCcapCoinDollar);

                // req.user.amountUserCcapCoin = parseFloat(req.user.amountUserCcapCoin) + amountCcapCoinDollar;
                // await req.user.save();

                return res.status(201).send({success: 'success dollar deposit'});

            case "bitcoin":

                let amountCcapCoinBitCoin = parseFloat(req.body.amountDeposit) * parseFloat(currentRate[1]) * parseFloat(baseRate[0].baseCurrencyRateInverseToUSD);

                amountCcapCoinBitCoin = roundUsing(Math.floor, amountCcapCoinBitCoin, 8);

                userMoney.userId = req.user;
                userMoney.userMoney.deposit = {
                    "currencyDeposit": "bitcoin",
                    "amountDeposit": amountCcapCoinBitCoin,
                    "status": statusCategory[0].pending
                };

                await userMoney.save();

                console.log(amountCcapCoinBitCoin);

                // req.user.amountUserCcapCoin = parseFloat(req.user.amountUserCcapCoin) + amountCcapCoinBitCoin;
                // await req.user.save();

                return res.status(201).send({success: 'success bitcoin deposit'});

        }

        res.status(400).send({error: 'problem!!'});

    } catch (e) {
        res.status(400).send({error: e.message});
    }


});


// todo
router.post('/donateMoney', checkUserLogin, async (req, res) => {

    try {
        // console.log(req.body);
        // console.log(req.user);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['ccapCoinIdDonateTo', 'amountDonate', 'descriptionDonate'];

        const isValidOperation = updates.every((update) => allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const userCcapTo = await User.findOne({ccapCoinId: req.body.ccapCoinIdDonateTo});
        console.log(userCcapTo);

        if (userCcapTo.email !== req.user.email) {
            // console.log(parseFloat(req.user.amountUserCcapCoin))
            // console.log(parseFloat(req.body.amountDonate))
            if (parseFloat(req.user.amountUserCcapCoin) <= parseFloat(req.body.amountDonate)) {
                return res.status(400).send({error: "you cant donate this amount!!!"});
            } else {
                const statusCategory = await StatusCategory.find({});

                const userMoney = new UserMoney();
                userMoney.userId = req.user;
                userMoney.userMoney.donateTo = {
                    "ccapCoinIdDonateTo": req.body.ccapCoinIdDonateTo,
                    "amountDonate": req.body.amountDonate,
                    "descriptionDonate": req.body.descriptionDonate,
                    "status": statusCategory[0].success
                };

                userCcapTo.amountUserCcapCoin = roundUsing(Math.floor, (parseFloat(userCcapTo.amountUserCcapCoin) + parseFloat(req.body.amountDonate)), 8);
                req.user.amountUserCcapCoin = roundUsing(Math.floor,parseFloat(req.user.amountUserCcapCoin) - parseFloat(req.body.amountDonate), 8);

                await userMoney.save();
                await userCcapTo.save();
                await req.user.save();
            }
        } else {
            res.status(400).send({error: "you cant donate yourself!!!"});
        }


    } catch (e) {
        res.status(400).send({error: e.message});
    }


});

// todo
router.post('/cashoutMoney', checkUserLogin, async (req, res) => {

    try {
        console.log(req.body);
        console.log(req.user);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['address', 'amount'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }


    } catch (e) {
        res.status(400).send({error: e.message});
    }


});


router.post('/rootFindAllMoneyUserID', checkRootLogin, async (req, res) => {
    try {
        console.log(req.body);
        // console.log(req.user);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['userID'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const userMoneyObj = await UserMoney.find({userId: req.body.userID}).populate('userId');

        console.log(userMoneyObj);

        res.status(200).send({specificUserMoney: userMoneyObj});

    } catch (e) {
        res.status(400).send({error: e.message});
    }


});


// todo
router.post('/rootChangeSpecificMoneyStatusUser', checkRootLogin, async (req, res) => {

    try {
        console.log(req.body);
        // console.log(req.user);

        const updates = Object.keys(req.body);
        const allowedUpdatesArray0 = ['userMoneyID', 'status', 'which'];

        const isValidOperation = updates.every((update) =>
            allowedUpdatesArray0.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const statusCategory = await StatusCategory.find({});

        // const userMoneyObj = await UserMoney.findByIdAndUpdate(req.body.userMoneyID.toString(), {
        //     $set: {
        //         // 'isVerified.$.isVerifiedEmail':  true,
        //         "status": statusCategory[0].success,
        //         // "isVerified.$[].isVerifiedEmail": true,
        //         // "isVerified.$[]": {isVerifiedEmail:true},
        //     }
        // }, {new: true});
        const userMoneyObj = await UserMoney.findById(req.body.userMoneyID.toString()).populate('userId');

        console.log(userMoneyObj);

        if (req.body.which === "deposit") {
            switch (req.body.status) {
                case "success":
                    if (userMoneyObj.userMoney.deposit.status !== "success") {
                        if (userMoneyObj.userMoney.deposit.operator !== "+") {
                            const userObj = await User.findById(userMoneyObj.userId._id.toString());
                            userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) + parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                            userMoneyObj.userMoney.deposit.status = statusCategory[0].success;
                            userMoneyObj.userMoney.deposit.operator = "+";
                            await userMoneyObj.save();
                            await userObj.save();
                        }
                    }

                    break;
                case "failed":
                    if (userMoneyObj.userMoney.deposit.status !== "failed") {
                        if (userMoneyObj.userMoney.deposit.operator !== "-") {
                            if (!userMoneyObj.userMoney.deposit.operator) {
                                userMoneyObj.userMoney.deposit.status = statusCategory[0].failed;
                                await userMoneyObj.save();
                            } else {
                                const userObj = await User.findById(userMoneyObj.userId._id.toString());
                                userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) - parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                                userMoneyObj.userMoney.deposit.status = statusCategory[0].failed;
                                userMoneyObj.userMoney.deposit.operator = "-";
                                await userMoneyObj.save();
                                await userObj.save();
                            }
                        }
                    }

                    break;
                case "reject":
                    if (userMoneyObj.userMoney.deposit.status !== "reject") {
                        if (!userMoneyObj.userMoney.deposit.operator) {
                            userMoneyObj.userMoney.deposit.status = statusCategory[0].reject;
                            await userMoneyObj.save();
                        }
                        if (userMoneyObj.userMoney.deposit.operator !== "-") {
                            const userObj = await User.findById(userMoneyObj.userId._id.toString());
                            userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) - parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                            userMoneyObj.userMoney.deposit.status = statusCategory[0].reject;
                            userMoneyObj.userMoney.deposit.operator = "-";
                            await userMoneyObj.save();
                            await userObj.save();
                        }
                    }

                    break;
                case "pending":
                    if (userMoneyObj.userMoney.deposit.status !== "pending") {
                        if (!userMoneyObj.userMoney.deposit.operator) {
                            userMoneyObj.userMoney.deposit.status = statusCategory[0].pending;
                            await userMoneyObj.save();
                        }
                        if (userMoneyObj.userMoney.deposit.operator !== "-") {
                            const userObj = await User.findById(userMoneyObj.userId._id.toString());
                            userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) - parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                            userMoneyObj.userMoney.deposit.status = statusCategory[0].pending;
                            userMoneyObj.userMoney.deposit.operator = "-";
                            await userMoneyObj.save();
                            await userObj.save();
                        }
                    }

                    break;
                default:

            }


        } else if (req.body.which === "donate") {
            switch (req.body.status) {
                case "success":
                    if (userMoneyObj.userMoney.deposit.status !== "success") {
                        // const userObj = await User.findById(userMoneyObj.userId._id.toString());
                        userMoneyObj.userMoney.donateTo.status = statusCategory[0].success;
                        // userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) + parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                        await userMoneyObj.save();
                        // await userObj.save();
                    }
                    break;
                case "failed":
                    if (userMoneyObj.userMoney.deposit.status !== "failed") {
                        //         const userObj = await User.findById(userMoneyObj.userId._id.toString());
                        userMoneyObj.userMoney.donateTo.status = statusCategory[0].failed;
                        //         userObj.amountUserCcapCoin = parseFloat(userObj.amountUserCcapCoin) - parseFloat(userMoneyObj.userMoney.deposit.amountDeposit);
                        await userMoneyObj.save();
                    }
                    break;

                default:

            }
        } else if (req.body.which === "cashout") {
            switch (req.body.status) {

                case "success":

                    break;
                case "failed":

                    break;
                case "reject":

                    break;
                case "pending":

                    break;
                default:

            }
        }

    } catch (e) {
        res.status(400).send({error: e.message});
    }


});






router.post('/createmaster', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdatesArray = ['emailMaster', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    const masterPanel = new MasterPanel(req.body);

    try {
        await masterPanel.save();
        // sendWelcomeEmail(user.email, user.name)
        const token = await masterPanel.generateAuthToken();
        //console.log(user)
        res.status(201).send({masterPanel, token});
    } catch (e) {
        res.status(400).send(e)
    }

});

// router.post('/create_category', checkRootLogin, async (req, res) => {
router.post('/createcategory', checkRootLogin, async (req, res) => {

    try {

        const updates = Object.keys(req.body);
        const updates1 = Object.keys(req.body.categoryName[0]);

        const allowedUpdatesArray = ['categoryName'];
        const allowedUpdatesArray1 = ['category'];

        const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update));
        const isValidOperation1 = updates1.every((update) => allowedUpdatesArray1.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }
        if (!isValidOperation1) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }
        if (req.body.categoryName.length === 0) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const categoryPackageObj = new CategoryPackage(req.body);

        // const find = await CategoryPackage.findOne({"category.categoryName": req.body.category[0].categoryName});
        const find = await CategoryPackage.find({});
        if (find.length === 0) {
            await categoryPackageObj.save();
        } else {
            await CategoryPackage.updateMany({}, {$set: req.body});
        }

        res.status(201).send({"Success": "update or create new category"});
    } catch (e) {
        res.status(400).send(e)
    }

});

router.get('/getcategory', async (req, res) => {
    try {
        const findCategory = await CategoryPackage.find({});

        res.status(200).send(findCategory[0]);
    } catch (e) {
        res.status(400).send(e)
    }
});


router.post('/createexpiredate', checkRootLogin, async (req, res) => {

    try {

        const updates = Object.keys(req.body);

        const allowedUpdatesArray = ['expireDatePackage', 'numberOfDownload'];
        const isValidOperation = updates.every((update) => allowedUpdatesArray.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid Request Body'})
        }

        const expireDateObj = new ExpireDate(req.body);

        const find = await ExpireDate.find({});
        if (find.length === 0) {
            await expireDateObj.save();
        } else {
            let productToUpdate = {};
            productToUpdate = Object.assign(productToUpdate, expireDateObj._doc);
            delete productToUpdate._id;
            await ExpireDate.updateMany({}, {$set: productToUpdate});
        }

        res.status(201).send({"Success": "update or create new expireDate"});
    } catch (e) {
        res.status(400).send(e)
    }

});


router.get('/download', function (req, res) {
    let filePath = path.join(__dirname, '../');
    console.log(filePath);
    // const file = `${__dirname}/upload-folder/dramaticpenguin.MOV`;
    const file = './uploads/user/022 How to Sideload Your App using Xcode.mp4';
    res.download(file);
});

/* const errorMiddleware =  (req, rec) =>  {
    throw new Error('From my middleware ')
} */
// modify post request to handle errors 

// router.use("/users/me/avatar", upload.single("avatar"));

// router.post('/uploadPackage', checkRootLogin, upload.single('file'), async (req, res) => {
// router.post('/uploadPackage', checkRootLogin, checkPreUpload, upload("../../uploads/packages").array('files', 3), async (req, res) => {
router.post('/uploadPackage', checkRootLogin, checkPreUploadImgCard, async (req, res) => {


    // console.log(req.files);
    // console.log(req);
    // console.log(req.body);

    const packageObj = new Package();
    packageObj.emailMaster = req.body.emailMaster;
    packageObj.nameMaster = req.body.nameMaster;
    packageObj.description = req.body.description;
    packageObj.imgPackageLink = req.userID + "__" + req.files.files[0].name;
    packageObj.filePackageLink = req.userID + "__" + req.files.files[1].name;
    packageObj.previewPackageLink = req.userID + "__" + req.files.files[2].name;
    // const categoryPackageObj = new CategoryPackage(req.body.categoryPackage);
    // packageObj.categoryPackage = categoryPackageObj;
    packageObj.amount = req.body.amount;
    packageObj.categoryPackage = req.body.categoryPackage;
    packageObj.likeNumber = req.body.likeNumber;
    packageObj.viewNumber = req.body.viewNumber;
    // const expireDateObj = new ExpireDate(req.body.expireDate);
    // packageObj.expireDatePackage = req.body.expireDatePackage;
    // packageObj.numberOfDownload = req.body.numberOfDownload;
    // packageObj.numberOfDownloaded = req.body.numberOfDownloaded;
    packageObj.sizeOfPackage = req.body.sizeOfPackage;
    packageObj.durationOfPackage = req.body.durationOfPackage;

    // req.rootUser.categoryRootPackage = categoryPackageObj;
    //
    // if (!req.rootUser.categoryRootPackage){
    //     await categoryPackageObj.save();
    // }else{
    // }


    // await categoryPackageObj.save();
    // await expireDateObj.save();

    // await CategoryPackage.updateMany({}, {$set:  req.body.categoryPackage });
    // await ExpireDate.updateMany({}, {$set:  req.body.expireDate });
    await packageObj.save();

    // const bufferFile = await fs.readFileSync(req.file.path);
    // const buffer = await sharp(bufferFile)
    //                             .resize({ width : 250, heigth : 250})
    //                             .png()
    //                             .toBuffer();

    // var test = new Test();
    // test.img.data = buffer;
    // await test.save();
    res.status(201).send({"Success": "create new package"});

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

// router.patch('/updatePackage', checkRootLogin, upload("../../uploads/packages").array('updPK', 3), async (req, res) => {
router.patch('/updatePackage', checkRootLogin, checkPreUpdate, async (req, res) => {

    // console.log(req.params.id);
    // console.log(req.body);
    // console.log(req.files);
    // console.log(req.body.id);

    const packageObj = new Package();
    packageObj.emailMaster = req.body.emailMaster;
    packageObj.nameMaster = req.body.nameMaster;
    packageObj.description = req.body.description;
    packageObj.imgPackageLink = req.userID + "__" + req.files.files[0].name;
    packageObj.filePackageLink = req.userID + "__" + req.files.files[1].name;
    packageObj.previewPackageLink = req.userID + "__" + req.files.files[2].name;
    packageObj.amount = req.body.amount;
    packageObj.categoryPackage = req.body.categoryPackage;
    packageObj.likeNumber = req.body.likeNumber;
    packageObj.viewNumber = req.body.viewNumber;
    // packageObj.expireDatePackage = req.body.expireDatePackage;
    // packageObj.numberOfDownload = req.body.numberOfDownload;
    // packageObj.numberOfDownloaded = req.body.numberOfDownloaded;
    packageObj.sizeOfPackage = req.body.sizeOfPackage;
    packageObj.durationOfPackage = req.body.durationOfPackage;

    let productToUpdate = {};
    productToUpdate = Object.assign(productToUpdate, packageObj._doc);
    delete productToUpdate._id;

    await Package.findByIdAndUpdate(req.body.id, productToUpdate, {new: true});

    res.status(200).send({"success": "good update!!"});

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

router.post('/createslide', checkRootLogin, upload("../../public/img/slides").array('files'), async (req, res) => {

    // try {

    if (req.files.length === 0) {

        await fsExtra.emptyDirSync(path.join(__dirname, '../../public/img/slides'));
        await Slide.deleteMany({});

        return res.status(400).send({error: 'Empty Request Body'})
    }

    const slideObj = new Slide();
    let filesOriginalName = [];

    for (let i = 0; i < req.files.length; i++) {
        slideObj.slide[i] = {slideLink: "/img/slides/" + req.files[i].originalname};
        filesOriginalName[i] = req.files[i].originalname;
    }

    await fs.readdir(path.join(__dirname, '../../public/img/slides'), function (err, files) {
        //handling error
        if (err) {
            return res.status(500).send({error: 'Unable to scan directory'});
        }

        files.forEach(async function (file) {
            if (!filesOriginalName.includes(file)) {
                await fs.unlinkSync(path.join(__dirname, '../../public/img/slides/' + file));
            }

        });

    });

    const find = await Slide.find({});

    if (find.length === 0) {
        await slideObj.save();
    } else {
        let productToUpdate = {};
        productToUpdate = Object.assign(productToUpdate, slideObj._doc);
        delete productToUpdate._id;

        await Slide.updateMany({}, {$set: productToUpdate});
    }

    res.status(201).send({"Success": "update or create new slide"});
    // } catch (e) {
    //     res.status(400).send(e)
    // }

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

router.get('/getslide', async (req, res) => {
    try {
        const findSlide = await Slide.find({});

        res.status(200).send(findSlide[0]);
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/createadvertisement', checkRootLogin, upload("../../public/img/advertisements").array('files'), async (req, res) => {

    // try {

    if (req.files.length === 0) {
        await fsExtra.emptyDirSync(path.join(__dirname, '../../public/img/advertisements'));
        await Advertisement.deleteMany({});

        return res.status(400).send({error: 'Empty Request Body'})
    }

    const advertisementObj = new Advertisement();
    let filesOriginalName = [];

    for (let i = 0; i < req.files.length; i++) {
        advertisementObj.advertisement[i] = {advertisementLink: "/img/advertisements/" + req.files[i].originalname};
        filesOriginalName[i] = req.files[i].originalname;
    }

    await fs.readdir(path.join(__dirname, '../../public/img/advertisements'), function (err, files) {
        if (err) {
            return res.status(500).send({error: 'Unable to scan directory'});
        }

        files.forEach(async function (file) {
            if (!filesOriginalName.includes(file)) {
                await fs.unlinkSync(path.join(__dirname, '../../public/img/advertisements/' + file));
            }

        });

    });

    const find = await Advertisement.find({});
    if (find.length === 0) {
        await advertisementObj.save();
    } else {
        let productToUpdate = {};
        productToUpdate = Object.assign(productToUpdate, advertisementObj._doc);
        delete productToUpdate._id;

        await Advertisement.updateMany({}, {$set: productToUpdate});
    }

    res.status(201).send({"Success": "update or create new advertisement"});
    // } catch (e) {
    //     res.status(400).send(e)
    // }

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
});

router.get('/getadvertisement', async (req, res) => {
    try {
        const findAdvertisement = await Advertisement.find({});

        res.status(200).send(findAdvertisement[0]);
    } catch (e) {
        res.status(400).send(e)
    }
});


// router.delete('/users/me/avatar', auth, async (req, res) => {
//     req.user.avatar = undefined;
//     try {
//         await req.user.save();
//         res.status(200).send()
//     } catch (e) {
//         res.status(500).send({
//             error: e.message
//         })
//     }
// });

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router;