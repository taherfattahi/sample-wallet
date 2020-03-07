const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/default-config');
const User = require('../models/user');
const RootUser = require('../models/root-user');
// const {Package} = require('../models/package');
const path = require('path');
const fs = require('fs');


// Allows cross-origin domains to access this API
// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//     res.append('Access-Control-Allow-Credentials', true);
//     next();
// });


const checkRootLogin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);

        const rootUser = await RootUser.findOne({_id: decoded._id, 'tokens.token': token});

        if (!rootUser) {
            throw new Error("User cannot find!!");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next()
    } catch (e) {
        res.status(401).send({error: 'Authentication problem!!'})
    }
};


const checkUserLogin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({_id: decoded._id, token: token}).populate('addUserCardId');

        if (!user) {
            throw new Error("User cannot find!!");
        }

        req.token = token;
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send({error: 'Authentication problem!!'})
    }
};

const checkPreUploadImgCard = async (req, res, next) => {
    try {
        //     console.log(req.body);
        //     console.log(req.files);
        //     console.log(req.user);

        const updates = Object.keys(req.body);

        let allowedUpdatesArray = [];


        for (let i = 0; i < req.user.isVerified.length; i++) {
            // console.log(Object.keys(req.user.isVerified[i])[0])
            // console.log(Object.keys(req.user.isVerified[i]))
            // console.log(Object.values(req.user.isVerified[i])[0])
            // console.log(req.user.isVerified[i]);
            switch (Object.keys(req.user.isVerified[i])[0]) {
                case "isVerifiedEmail":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("email");
                    }
                    break;
                case "isVerifiedPhoneNumber":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("phoneNumber");
                    }
                    break;
                case "isVerifiedName":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("name");
                    }
                    break;
                case "isVerifiedFamilyName":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("familyName");
                    }
                    break;
                case "isVerifiedCountry":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("country");
                    }
                    break;
                case "isVerifiedCity":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("city");
                    }
                    break;
                case "isVerifiedImgCardLink":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("city");
                    }
                    break;
                case "isVerifiedJob":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("job");
                    }
                    break;
                case "isVerifiedDateOfBirth":
                    if (!Object.values(req.user.isVerified[i])[0]) {
                        allowedUpdatesArray.push("dateOfBirth");
                    }
                    break;
            }
        }

        if (!req.user.password) {
            allowedUpdatesArray.push("password");
        }

        allowedUpdatesArray.push("nickName", "baseCurrency");

        const isValidOperation = updates.every((update) => {
            // console.log(update)
            // console.log(allowedUpdatesArray.includes(update))
            return allowedUpdatesArray.includes(update)
        });

        if (!isValidOperation) {
            // return res.status(400).send({error: 'Invalid Request Body'})
            // throw new Error('Invalid Request Body');
            res.status(400).send({error: 'Invalid Request Body'})
        }

        // todo
        if (req.files){
            if (req.files.files.length) {
                throw new Error('Invalid Request Body');
            }

            if (!req.user.isVerified[5].isVerifiedImgCardLink) {

                const uploadPath0 = path.join(__dirname, "../../public/img/imgCard/") + req.user._id + "__" + req.files.files.name;
                const uploadPath1 = path.join(__dirname, "../../public/img/imgCard/");

                await fs.readdir(uploadPath1, async function (err, files) {
                    if (err) {
                        return res.status(500).send({error: 'Unable to scan directory'});
                    }

                    files.forEach(async function (file) {
                        // if (req.user._id + "__" +  req.files.files.name !== file) {
                        if (file.includes(req.user._id)) {
                            await fs.unlinkSync(uploadPath1 + file);
                        }
                    });

                    await req.files.files.mv(uploadPath0);
                });

            }
        }

        next()

    } catch (e) {
        res.status(400).send({error: e.message});
    }
};


const checkPreUpdate = async (req, res, next) => {

    // try {
    // console.log(req.body);
    // console.log(req.files);

    const updates = Object.keys(req.body);

    const allowedUpdatesArray = ['id', 'emailMaster', 'nameMaster', 'description', 'categoryPackage',
        'amount', 'sizeOfPackage', 'durationOfPackage'];

    const isValidOperation = updates.every((update) => {
        return allowedUpdatesArray.includes(update)
    });

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Request Body'})
    }

    if (req.files.length < 3) {
        // return res.status(400).send({error: 'Invalid Request Body'})
        throw new Error('Invalid Request Body');
    }

    uploadPath0 = path.join(__dirname, "../../public/img/packages/");
    uploadPath1 = path.join(__dirname, "../../uploads/packages/");
    uploadPath2 = path.join(__dirname, "../../public/video/prevPackages/");
    // console.log(req.files.files[0]);

    // await req.files.files[0].mv(uploadPath0);
    // await req.files.files[1].mv(uploadPath1);
    // await req.files.files[2].mv(uploadPath2);

    const prePackage = await Package.findById(req.body.id);

    await fs.readdir(uploadPath1, function (err, files) {
        if (err) {
            return res.status(500).send({error: 'Unable to scan directory'});
        }

        files.forEach(async function (file) {
            // console.log(file);
            // console.log(prePackage.filePackageLink);
            // console.log(prePackage.filePackageLink !== file);
            if (prePackage.filePackageLink !== file) {
                await fs.unlinkSync(uploadPath1 + file);
            }
        });

    });
    await fs.readdir(uploadPath0, function (err, files) {
        if (err) {
            return res.status(500).send({error: 'Unable to scan directory'});
        }

        files.forEach(async function (file) {
            if (prePackage.imgPackageLink !== file) {
                await fs.unlinkSync(uploadPath0 + file);
            }
        });

    });
    await fs.readdir(uploadPath2, function (err, files) {
        if (err) {
            return res.status(500).send({error: 'Unable to scan directory'});
        }

        files.forEach(async function (file) {
            if (prePackage.previewPackageLink !== file) {
                await fs.unlinkSync(uploadPath2 + file);
            }
        });

    });

    await req.files.files[0].mv(uploadPath0 + req.files.files[0].name);
    await req.files.files[1].mv(uploadPath1 + req.files.files[1].name);
    await req.files.files[2].mv(uploadPath2 + req.files.files[2].name);


    // await req.files.files[2].mv(uploadPath2, function(err) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //
    //     // res.send('File uploaded to ' + uploadPath2);
    // });

    // upload("../../uploads/packages").array('files', 3);


    next()
    // }catch(e){
    //     res.status(401).send({ error : 'Invalid Request Body!!' })
    // }
};


module.exports = {checkUserLogin, checkRootLogin, checkPreUploadImgCard, checkPreUpdate};