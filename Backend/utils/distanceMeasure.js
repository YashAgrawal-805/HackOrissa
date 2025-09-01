const geolib = require("geolib");
const admin = require("../config/firebase");

const db = admin.firestore();

async function distanceMeasure(userId) {
  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    // 1️⃣ Get the user doc
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    if (
      !userData.groups ||
      !Array.isArray(userData.groups) ||
      userData.groups.length === 0
    ) {
      return { message: "User is not in any groups", notifications: [] };
    }

    if (!userData.lastLocation) {
      throw new Error("User location not found");
    }

    const notifications = [];

    // 2️⃣ Loop through groups
    for (const groupId of userData.groups) {
      const groupDoc = await db.collection("groups").doc(groupId).get();
      if (!groupDoc.exists) continue;

      const groupData = groupDoc.data();

      // Skip inactive groups
      if (!groupData.ISactive) continue;

      // ✅ Fetch admin info
      const adminId = groupData.admin;
      if (!adminId) continue;

      const adminDoc = await db.collection("users").doc(adminId).get();
      if (!adminDoc.exists) continue;

      const adminData = adminDoc.data();
      if (!adminData.lastLocation) continue;

      // 3️⃣ Calculate distance
      const distance = geolib.getDistance(
        {
          latitude: userData.lastLocation.latitude,
          longitude: userData.lastLocation.longitude,
        },
        {
          latitude: adminData.lastLocation.latitude,
          longitude: adminData.lastLocation.longitude,
        }
      );

      if (distance > 7000) {
        const km = (distance / 1000).toFixed(2);
        const msg = `${
          userData.username || "A member"
        } is ${km} km away from you in group ${groupData.groupName}`;

        // Store notification in Firestore
        // await db.collection("notifications").add({
        //   to: adminData.phone,
        //   message: msg,
        //   timestamp: admin.firestore.FieldValue.serverTimestamp(),
        // });

        notifications.push({ groupId, message: msg });
      }
    }

    return { message: "Distance check complete", notifications };
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw error;
  }
}

async function checkNearbyPlaces(userId) {
  if (!userId) {
    throw new Error("Missing userId");
  }

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  if (!userData.trackingEnabled || !userData.lastLocation) {
    return { message: "Tracking not enabled or no location set" };
  }

  const snapshot = await db.collection("imp_locations").get();
  let nearbyPlaces = [];

  snapshot.forEach((doc) => {
    const loc = doc.data();
    const distanceInKm = getDistanceFromLatLonInKm(
      userData.lastLocation.latitude,
      userData.lastLocation.longitude,
      loc.latitude,
      loc.longitude
    );

    if (distanceInKm <= 40) {
      nearbyPlaces.push({
        name: loc.name,
        distanceInKm,
        openTime: loc.openTime,
        closeTime: loc.closeTime,
      });
    }
  });
  let minDist = Infinity;
  let closestPlace = null;
  for (const place of nearbyPlaces) {
    if (place.distanceInKm < minDist) {
      minDist = place.distanceInKm;
      closestPlace = place;
    }
  }
  await db.collection("users").doc(userId).update({
    lastSharedAt: Date.now(),
    lastSharedPlace: closestPlace.name
  });

  return closestPlace;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { distanceMeasure, checkNearbyPlaces };
