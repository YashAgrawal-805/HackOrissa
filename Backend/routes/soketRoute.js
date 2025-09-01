const admin = require("../config/firebase");
const db = admin.firestore();
const { distanceMeasure, checkNearbyPlaces }  = require("../utils/distanceMeasure");


const liveTracking = (io)=>{
    io.on("connection", (socket) => {
        console.log("Client connected");
      
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

            const THIRTY_MIN = 30 * 60 * 1000;

            let location;

            if (!(userData.lastSharedAt && Date.now() - userData.lastSharedAt < THIRTY_MIN)) {
              location = await checkNearbyPlaces(userId);
              socket.emit("nearbyNotification", {
                message: `You are ${location.distanceInKm.toFixed(2)} km away from ${location.name}. Open: ${location.openTime} - ${location.closeTime}`,
                place: location
              });
            }
            distanceMeasure(userId)
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
      });
}

module.exports = liveTracking;