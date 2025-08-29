const jwt = require("jsonwebtoken");


function socketAuth(io){
    io.use((socket, next) => {
    const token = socket.handshake.auth.token; // 👈 comes from frontend        
      if (!token) {
        return next(new Error("No token provided"));
      }     
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "password"); // 👈 verify
        socket.user = decoded; // attach user info to socket
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }
    });
}

module.exports = socketAuth;