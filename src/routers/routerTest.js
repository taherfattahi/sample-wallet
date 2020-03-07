const express = require('express');
const User = require('../models/user');
const path = require('path');
const router = new express.Router();
const fs = require('fs');
const fsExtra = require('fs-extra');
// const multer = require('multer');
// const sharp = require('sharp');
// const getStream = require('get-stream/index');

// const {sendWelcomeEmail, sendRemoveUserEmail} = require('../emails/account')


router.get('/test', (req, res) => {
    res.send('From a new file')
})


router.get('/users/login', async (req, res) => {
    try {

        let userObj = new User();
        userObj.token = "test";
        userObj.save();
        // const user = await User.findByCredential(req.body.email, req.body.password)
        // const token = await user.generateAuthToken()




        res.status(200).send("ok")
    } catch (error) {
        //console.log(error)
        res.status(400).send(error.message || error)
    }
})


module.exports = router;