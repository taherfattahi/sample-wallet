
const app = require('./app');
// const port = process.env.PORT
const { port } = require('./src/config/default-config');


app.listen(port, ()=> { 
    console.log('Server is up on port ', port)
});

