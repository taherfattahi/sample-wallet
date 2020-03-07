const uuidv5 = require('uuid/v5');

module.exports = {
    debug: false,
    host: 'localhost',
    port: 3000,
    dbProtocol: 'mongodb://',
    dbHostName: '127.0.0.1:',
    dbPort: 27017,
    dbName: '/db-ccapcoin-src-project-api',
    JWT_SECRET: "test",
    MY_NAMESPACE : uuidv5('https://ccapcoin.com/teamthmrl', uuidv5.URL),
    MY_NAMESPACE1 : uuidv5('https://ccapcoin.com/teamthmrlMOid', uuidv5.URL)
};