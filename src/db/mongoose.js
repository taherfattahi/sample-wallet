const mongoose = require('mongoose');
const { dbProtocol, dbHostName, dbPort, dbName } = require('../config/default-config');

mongoose.connect(dbProtocol + dbHostName + dbPort + dbName, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true
});