// const cron = require('node-cron');
const express = require('express');
const app = express();

require('./src/db/mongoose');
const path = require('path');
// const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();

const userRouter = require('./src/routers/user');
const userRouterTest = require('./src/routers/routerTest');

const publicDirectoryPath = path.join(__dirname, './public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());
// app.use(multipartMiddleware);
app.use(fileUpload());
// app.use(express.urlencoded());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.multipart());
app.use(userRouter);
app.use(userRouterTest);

// cron.schedule('1 * * * * *', () => {
//     console.log('running a task every minute');
// });

module.exports = app;

