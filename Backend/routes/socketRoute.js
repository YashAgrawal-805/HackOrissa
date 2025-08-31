const admin = require("../config/firebase");
const db = admin.firestore();


// const liveTracking = (io)=>{

//   const onlineUsers = new Map();
//     io.on("connection", (socket) => {
//     console.log("✅ Client connected:", socket.id);

//      const userId = socket.user.id; 
//     onlineUsers.set(userId, socket.id);

//     console.log(`User ${userId} mapped to socket ${socket.id}`);

      
//         socket.on("location", async (data) => {
//           try {
//             const { latitude, longitude } = data;
//             const userId = socket.user.id;
//             const userRef = db.collection("users").doc(userId);
//             const snap = await userRef.get();
//             if (!snap.exists) {
//               return socket.emit("error", { error: "User not found" });
//             }
//             const userData = snap.data();
//             // Check if tracking enabled
//             if (!userData.trackingEnabled) {
//               return socket.emit("error", { error: "Tracking disabled" });
//             }
//             // Update last location
//             await userRef.update({
//               lastLocation: { latitude: latitude, longitude: longitude},
//             });
//             // Emit update (to others, e.g. admin dashboard)
//             io.emit("locationUpdate", {
//               userId,
//               latitude: latitude,
//               longitude: longitude,
//             });
//             console.log(`Updated location for ${userId}:`, latitude, longitude);
//           } catch (err) {
//             console.error("Socket location error:", err);
//             socket.emit("error", { error: "Internal server error" });
//           }
//           // 👉 broadcast to other users (e.g. admin dashboard)
//           io.emit("locationUpdate", data);
//         });
//       });
// }

// module.exports = liveTracking;


// events/socketEvents.js
module.exports = (io, socket, onlineUsers, db) => {
  /**
   * ----------------------
   * 📌 Group Events
   * ----------------------
   */
  socket.on("createGroup", ({ groupId, members }) => {
    members.forEach(memberId => {
      const memberSocket = onlineUsers.get(memberId);
      if (memberSocket) {
        io.to(memberSocket).emit("groupCreated", {
          groupId,
          message: "You were added to a new group!"
        });
      }
    });
  });

  /**
   * ----------------------
   * 📌 Tracking Events
   * ----------------------
   */
  socket.on("location", async (data) => {
          try {
            const { latitude, longitude } = data;
            const userId = socket.user.id;
            const userRef = db.collection("users").doc(userId);
            const snap = await userRef.get();
            if (!snap.exists) {
              return socket.emit("error", { error: "User not found" });
            }
            const userData = snap.data();
            // Check if tracking enabled
            if (!userData.trackingEnabled) {
              return socket.emit("error", { error: "Tracking disabled" });
            }
            // Update last location
            await userRef.update({
              lastLocation: { latitude: latitude, longitude: longitude},
            });
            // Emit update (to others, e.g. admin dashboard)
            io.emit("locationUpdate", {
              userId,
              latitude: latitude,
              longitude: longitude,
            });
            console.log(`Updated location for ${userId}:`, latitude, longitude);
          } catch (err) {
            console.error("Socket location error:", err);
            socket.emit("error", { error: "Internal server error" });
          }
          // 👉 broadcast to other users (e.g. admin dashboard)
          io.emit("locationUpdate", data);
        });
  /**
   * ----------------------
   * 📌 Request Events
   * ----------------------
   */
  socket.on("sendRequest", ({ from, to }) => {
    const receiverSocket = onlineUsers.get(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newRequest", {
        from,
        message: "You received a new request!"
      });
    }
  });

  /**
   * ----------------------
   * 📌 Disconnect Cleanup
   * ----------------------
   */
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
};
