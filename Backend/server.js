require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const initSocketServer = require('./src/socket/socket.server');
const httpServer = require('http').createServer(app);


connectToDB();
initSocketServer(httpServer);

// app.listen(3000, () => {
//     console.log('listening');
// })
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log('listening');
});