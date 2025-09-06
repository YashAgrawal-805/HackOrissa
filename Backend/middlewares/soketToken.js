const jwt = require("jsonwebtoken");


function socketAuth(io){
    io.use((socket, next) => {
    console.log("Socket Auth Middleware triggered");
      // Extract token from query parameters
    const token = socket.handshake.auth.token; 
    console.log(token)// 👈 comes from frontend        
      if (!token) {
        console.log("No token provided");
        return next(new Error("No token provided"));
      }     
      try {
        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "password"); // 👈 verify
        console.log("Socket authenticated:", decoded);
        socket.user = decoded; // attach user info to socket
        console.log("Socket authenticated:", decoded);
        next();
      } catch (err) {
        console.log("Token verification failed:", err);
        next(new Error("Invalid token"));
      }
    });
}

module.exports = socketAuth;