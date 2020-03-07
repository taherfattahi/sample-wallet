const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = (dest) => {

    return multer.diskStorage({
        destination: function (req, file, cb) {
            let newDestination = "";
            // console.log(req.body);
            // if (file.fieldname === "updPK") {
            //     // if (file.mimetype !== "video/mp4") {
            //         if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== "video/mp4" && file.mimetype !== 'application/zip') {
            //             return cb(new Error('Invalid image format'));
            //         }
            //         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //             newDestination = path.join(__dirname, "../../public/img/packages");
            //         } else if (file.mimetype === "video/mp4") {
            //             newDestination = path.join(__dirname, dest);
            //         }
            //     // }else{
            //     //     newDestination = path.join(__dirname, dest);
            //     // }
            // } else {
                if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== "video/mp4" && file.mimetype !== 'application/zip') {
                    return cb(new Error('Invalid format'));
                }
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
                    newDestination = path.join(__dirname, "../../public/img/packages");
                }else if(file.mimetype === "video/mp4"){
                    newDestination = path.join(__dirname, "../../public/video/prevPackages");
                }else{
                    newDestination = path.join(__dirname, dest);
                }
            // }
            // console.log();
            // console.log(file.originalname.slice(file.originalname.indexOf("." + file.originalname.split('.').pop()),));

            // console.log(newDestination);
            // let newDestination = './uploads/' + dest;
            let stat = null;
            try {
                stat = fs.statSync(newDestination);
            } catch (err) {
                fs.mkdirSync(newDestination);
            }
            if (stat && !stat.isDirectory()) {
                return cb(new Error('Directory cannot be created'));

            }
            cb(null, newDestination);
        },
        filename: function (req, file, cb) {
            cb(null, req.userID + "__" + file.originalname)
        }
    });

};
// const storagePackage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         var newDestination = './uploads/' + "user";
//         var stat = null;
//         try {
//             stat = fs.statSync(newDestination);
//         } catch (err) {
//             fs.mkdirSync(newDestination);
//         }
//         if (stat && !stat.isDirectory()) {
//             throw new Error('Directory cannot be created');
//         }
//         cb(null, newDestination);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });

// const uploadPackage = multer(
//     {
//         // dest: 'uploads/',
//         // limits: {
//         //     fieldNameSize: 100,
//         //     fileSize: 60000000
//         // },
//         // storage: storage
//         storage: storage("packages")
//     }
// );

const upload = (dest) => {
    return multer(
        {
            // dest: 'uploads/',
            // limits: {
            //     fieldNameSize: 100,
            //     fileSize: 60000000
            // },
            // storage: storage
            storage: storage(dest)
        }
    );
};

// const upload = (dest) => {
//     return multer.fields([{
//             name: 'video', maxCount: 1
//         }, {
//             name: 'subtitles', maxCount: 1
//         }],
//         {
//             // dest: 'uploads/',
//             // limits: {
//             //     fieldNameSize: 100,
//             //     fileSize: 60000000
//             // },
//             // storage: storage
//             storage: storage(dest)
//         });
// };


// const storageAdvertisement = multer.diskStorage({
//     destination: function (req, file, cb) {
//         var newDestination = './uploads/' + "user";
//         var stat = null;
//         try {
//             stat = fs.statSync(newDestination);
//         } catch (err) {
//             fs.mkdirSync(newDestination);
//         }
//         if (stat && !stat.isDirectory()) {
//             throw new Error('Directory cannot be created');
//         }
//         cb(null, newDestination);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
//
// const uploadAdvertisement = multer(
//     {
//         // dest: 'uploads/',
//         // limits: {
//         //     fieldNameSize: 100,
//         //     fileSize: 60000000
//         // },
//         // storage: storage
//         storageAdvertisement
//     }
// );

module.exports = upload;