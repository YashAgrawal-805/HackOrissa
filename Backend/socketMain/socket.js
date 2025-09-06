// const groupEvents = require("./events/groupEvents");
// const trackingEvents = require("./events/trackingEvents");
// const requestEvents = require("./events/requestEvents");

// const liveTracking = (io, db) => {
//   const onlineUsers = new Map();

//   io.on("connection", (socket) => {
//     console.log("✅ Client connected:", socket.id);
//     const userId = socket.user.id;
//     onlineUsers.set(userId, socket.id);

//     // Attach features
//     groupEvents(io, socket, onlineUsers);
//     trackingEvents(io, socket, onlineUsers, db);
//     requestEvents(io, socket, onlineUsers);
//   });
// };

// module.exports = liveTracking;


// socketRoute.js
const socketEvents = require("../routes/socketRoute");

const liveTracking = (io, db) => {
  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    // Attach all event listeners
    socketEvents(io, socket, onlineUsers, db);
  });
};

module.exports = liveTracking;

