var express = require('express');
var http = require('http');
var app = express();

// Create an HTTP server instance
var server = http.createServer(app);

// Initialize socket.io with the HTTP server instance
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

// Change port number to 3000 or any other available port

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', userName => {
        console.log("new user", userName);
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, userName: users[socket.id] });
    });
    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            socket.broadcast.emit('left', userName);
            delete users[socket.id];
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
/*PS C:\Users\Gayatri\Downloads\xampp\tmp\Desktop\Node js in Vs code\ChatApp> cd nodeserver
PS C:\Users\Gayatri\Downloads\xampp\tmp\Desktop\Node js in Vs code\ChatApp\nodeserver> npm run dev 
 
> nodeserver@1.0.0 dev
> nodemon index.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Server is running on http://localhost:3000
new user gayatri
new user sam
*/