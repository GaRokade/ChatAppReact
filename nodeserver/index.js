var express = require("express");
var http = require("http");
var app = express();

// Use environment variables for dynamic port assignment
const PORT = process.env.PORT || 3000;

// Create an HTTP server instance
var server = http.createServer(app);

// Serve static files (optional, if needed for a frontend)
app.use(express.static("public"));
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Suppresses the favicon error
});

// Initialize socket.io with the HTTP server instance
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity. Update this in production for security.
  },
});

// Store active users
const users = {};

// Set up socket.io connection handling
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Handle new user joining
  socket.on("new-user-joined", (userName) => {
    console.log("New user joined:", userName);
    users[socket.id] = userName; // Map socket ID to user name
    socket.broadcast.emit("user-joined", userName); // Notify other users
  });

  // Handle message sending
  socket.on("send", (message) => {
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit("receive", { message: message, userName });
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const userName = users[socket.id];
    if (userName) {
      console.log(`${userName} disconnected`);
      socket.broadcast.emit("left", userName); // Notify others
      delete users[socket.id]; // Remove user from the list
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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
