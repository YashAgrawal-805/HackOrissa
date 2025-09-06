const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middlewares/authenticateToken');
const admin = require("../config/firebase");
const geolib = require('geolib');

const db = admin.firestore();


//toggle-tracking

router.post('/toggle-tracking', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // 1️⃣ Fetch user doc
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userSnap.data();

    // 2️⃣ Toggle trackingEnabled
    const currentStatus = userData.trackingEnabled || false;
    const newStatus = !currentStatus;

    // 3️⃣ Update Firestore
    await userRef.update({
      trackingEnabled: newStatus
    });

    res.json({ 
      message: `Tracking ${newStatus ? 'enabled' : 'disabled'} for user`,
      trackingEnabled: newStatus
    });

  } catch (err) {
    console.error('Error toggling tracking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//toggle-group-activation

router.post('/toggle-group-activation', authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ error: 'Missing groupId' });
    }

    // 1️⃣ Fetch group
    const groupRef = db.collection('groups').doc(groupId);
    const groupSnap = await groupRef.get();

    if (!groupSnap.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = groupSnap.data();

    // 2️⃣ Check if current user is admin
    if (!groupData.admin || groupData.admin !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can toggle group' });
    }

    // 3️⃣ Negate ISactive (default false if not present)
    const currentStatus = groupData.ISactive || false;
    const newStatus = !currentStatus;

    // 4️⃣ Update Firestore
    await groupRef.update({ ISactive: newStatus });

    res.json({ 
      message: `Group ${newStatus ? 'activated' : 'deactivated'} successfully`,
      ISactive: newStatus
    });

  } catch (err) {
    console.error('Error toggling group:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//create group

router.post('/create-group', authenticateToken, async (req, res) => {
  try {
    const { groupName, subAdminPhone, memberPhones } = req.body;
    const adminPhone = req.user.phone;

    if (!groupName || !adminPhone || !Array.isArray(memberPhones)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    const usersRef = db.collection('users');

    // Fetch admin
    const adminSnapshot = await usersRef.where('phone', '==', adminPhone).get();
    if (adminSnapshot.empty) return res.status(404).json({ error: 'Admin not found' });
    const adminDoc = adminSnapshot.docs[0];

    // Fetch sub-admin (optional)
    let subAdminDoc = null;
    if (subAdminPhone) {
      const subAdminSnapshot = await usersRef.where('phone', '==', subAdminPhone).get();
      if (subAdminSnapshot.empty) return res.status(404).json({ error: 'Sub-admin not found' });
      subAdminDoc = subAdminSnapshot.docs[0];
    }
    // Fetch all members by phone
    const memberIds = [];
    for (const phone of memberPhones) {
      const snapshot = await usersRef.where('phone', '==', phone).get();
      if (snapshot.empty) return res.status(404).json({ error: `User with phone ${phone} not found` });
      memberIds.push(snapshot.docs[0].id);
    }
    console.log('Member IDs:', memberIds);
    // Add admin and sub-admin to members list if not already there
    if (!memberIds.includes(adminDoc.id)) memberIds.push(adminDoc.id);
    if (subAdminDoc && !memberIds.includes(subAdminDoc.id)) memberIds.push(subAdminDoc.id);

    // Create group object (store only IDs)
    const groupData = {
      groupName,
      admin: adminDoc.id,
      subAdmin: subAdminDoc ? subAdminDoc.id : null,
      ISactive: false, // initially inactive
      members: memberIds
    };
    console.log('Group Data:', groupData);
    // Save group to Firestore and get ID
    const groupRef = await db.collection('groups').add(groupData);
    const groupId = groupRef.id;
    console.log('New Group ID:', groupId);
    // Update each member’s user document to store groupId
    const updatePromises = memberIds.map(userId =>
      usersRef.doc(userId).update({
        groups: admin.firestore.FieldValue.arrayUnion(groupId)
      })
    );
    await Promise.all(updatePromises);

     // ✅ Trigger socket event manually here
    req.io.emit("createGroup", { groupId, members: memberIds });

    
    console.log('Group created with ID:', groupId);
    res.status(201).json({ message: 'Group created successfully', groupId, groupData });

  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







///calculate distance

router.post('/calculate-distance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get the user doc (the logged-in user)
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    if (!userData.groups || userData.groups.length === 0) {
      return res.json({ message: 'User is not in any groups' });
    }

    if (!userData.lastLocation) {
      return res.status(400).json({ error: 'Admin location not found' });
    }

    const notifications = [];

    // 2️⃣ Loop through groups the user is in
    for (const groupId of userData.groups) {
      const groupDoc = await db.collection('groups').doc(groupId).get();
      if (!groupDoc.exists) continue;

      const groupData = groupDoc.data();

      // ✅ Check if the logged-in user is the admin
      if (groupData.admin !== userId) continue; // skip if not admin

      // Skip inactive groups
      if (!groupData.ISactive) continue;

      // ✅ Get all group members
      if (!groupData.members || !Array.isArray(groupData.members)) continue;

      for (const memberId of groupData.members) {
        if (memberId === userId) continue; // skip self (admin)

        const memberDoc = await db.collection('users').doc(memberId).get();
        if (!memberDoc.exists) continue;

        const memberData = memberDoc.data();
        if (!memberData.lastLocation) continue;

        // 3️⃣ Calculate distance
        const distance = geolib.getDistance(
          { latitude: userData.lastLocation.latitude, longitude: userData.lastLocation.longitude },
          { latitude: memberData.lastLocation.latitude, longitude: memberData.lastLocation.longitude }
        );

        if (distance > 7000) {
          const km = (distance / 1000).toFixed(2);
          const msg = `${memberData.username || 'A member'} is ${km} km away from you in group ${groupData.groupName}`;

          // Store notification in Firestore (optional)
          await db.collection('notifications').add({
            to: userData.phone, // admin's phone
            message: msg,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });

          notifications.push({ groupId, message: msg });
        }
      }
    }

    res.json({ message: 'Distance check complete', notifications });

  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//solo-toggle
// const geolib = require("geolib");

router.post('/toggle-solo', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;  // fixed destructuring

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // 1️⃣ Fetch user doc
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userSnap.data();

    // 2️⃣ Toggle isSolo
    const currentStatus = userData.Issolo || false;
    const newStatus = !currentStatus;

    // 3️⃣ Update Firestore
    await userRef.update({
      Issolo: newStatus   // ✅ fixed typo (was Issolo)
    });

    // 4️⃣ If solo enabled → check nearby solo travelers
    let nearbyUsers = [];
    if (newStatus && userData.lastLocation) {
      const usersRef = db.collection("users");
      const allUsersSnap = await usersRef.get();

      allUsersSnap.forEach((doc) => {
        if (doc.id === userId) return; // skip self
        const data = doc.data();
        if (data.Issolo && data.lastLocation) {
          const distance = geolib.getDistance(
            { latitude: userData.lastLocation.latitude, longitude: userData.lastLocation.longitude },
            { latitude: data.lastLocation.latitude, longitude: data.lastLocation.longitude }
          );

          if (distance <= 10000) { // within 10 km
            nearbyUsers.push({
              id: doc.id,
              username: data.username || "Unknown",
              distance: (distance / 1000).toFixed(2) + " km"
            });
          }
        }
      });

      // 5️⃣ Emit solo traveler update to all nearby users
      nearbyUsers.forEach(user => {
        const socketId = global.onlineUsers?.get(user.id); // depends on how you stored socket mapping
        if (socketId) {
          req.io.to(socketId).emit("soloTravelerNearby", {
            id: userId,
            username: userData.username || "Unknown",
            distance: user.distance,
            message: `${userData.username || "A user"} is also traveling solo nearby!`
          });
        }
      });
    }
    console.log(nearbyUsers);

    res.json({ 
      message: `Solo mode ${newStatus ? 'enabled' : 'disabled'} for user`,
      Issolo: newStatus,
      nearbyUsers
    });

  } catch (err) {
    console.error('Error toggling solo mode:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//add-location

router.post('/add-locations', async (req, res) => {
  try {
    const locations = req.body.locations; // expecting array

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty locations list' });
    }

    // Validate each entry
    for (const loc of locations) {
      if (!loc.name || !loc.latitude || !loc.longitude || !loc.openTime || !loc.closeTime) {
        return res.status(400).json({ error: 'Each location must have name, latitude, longitude, openTime, and closeTime' });
      }
    }

    const batch = db.batch();

    locations.forEach(loc => {
      const newDocRef = db.collection('imp_locations').doc();
      batch.set(newDocRef, {
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        openTime: loc.openTime,
        closeTime: loc.closeTime,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    res.status(201).json({ message: 'Locations added successfully', count: locations.length });

  } catch (err) {
    console.error('Error adding locations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//check-nearby-places


router.get('/check-nearby-places', async (req, res) => {
  try {
    // You can take userId from query params or JWT
    const userId = req.user.id; 

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Fetch the user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    if (!userData.trackingEnabled || !userData.lastLocation) {
      return res.json({ message: "Tracking not enabled or no location set" });
    }

    // Fetch important locations
    const snapshot = await db.collection('imp_locations').get();
    let nearbyPlaces = [];

    snapshot.forEach(doc => {
      const loc = doc.data();
      const distance = geolib.getDistance(
        { latitude: userData.lastLocation.latitude, longitude: userData.lastLocation.longitude },
        { latitude: loc.latitude, longitude: loc.longitude }
      );

      if (distance <= 40000) {
        nearbyPlaces.push({
          name: loc.name,
          distanceInKm: (distance / 1000).toFixed(2),
          openTime: loc.openTime,
          closeTime: loc.closeTime
        });
      }
    });

    // Optional: Store notifications
    for (const place of nearbyPlaces) {
      await db.collection('notifications').add({
        to: userData.phone,
        message: `You are ${place.distanceInKm} km away from ${place.name}. Open: ${place.openTime} - ${place.closeTime}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ nearbyPlaces });

  } catch (err) {
    console.error("Error in nearby check:", err);
    res.status(500).json({ error: "Server error" });
  }
});





//solo- check
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Find solo travellers around 20 km
// router.get('/find-solo-travellers', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming authenticateToken sets req.user.id



//     // 1. Get current user's data
//     const userDoc = await db.collection('users').doc(userId).get();
//     if (!userDoc.exists) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const userData = userDoc.data();
//     if (
//       !userData.lastLocation ||
//       !userData.lastLocation.latitude ||
//       !userData.lastLocation.longitude
//     ) {
//       return res.status(400).json({ error: 'User location not found' });
//     }

//     const userLat = userData.lastLocation.latitude;
//     const userLng = userData.lastLocation.longitude;

//     // 2. Get all solo travellers
//     const snapshot = await db.collection('users')
//       .where('Issolo', '==', true)
//       .get();

//     if (snapshot.empty) {
//       return res.json({ nearbyTravellers: [] });
//     }

//     // 3. Filter by 20 km radius
//     const nearbyTravellers = [];
//     snapshot.forEach(doc => {
//       if (doc.id === userId) return; // skip self
//       const data = doc.data();

//       if (
//         data.lastLocation &&
//         data.lastLocation.latitude &&
//         data.lastLocation.longitude
//       ) {
//         const distance = getDistanceFromLatLonInKm(
//           userLat, userLng,
//           data.lastLocation.latitude, data.lastLocation.longitude
//         );

//         if (distance <= 20) {
//           nearbyTravellers.push({
//             id: doc.id,
//             name: data.name,
//             phone: data.phone,
//             distance: Number(distance.toFixed(2))
//           });
//         }
//       }
//     });

//     // 4. Return nearby solo travellers
//     res.json({
//       message: 'Nearby solo travellers within 20 km',
//       nearbyTravellers
//     });

//   } catch (err) {
//     console.error('Error finding solo travellers:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/find-solo-travellers', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const userId = req.user.id;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: 'userId, latitude and longitude are required' });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // 1️⃣ Fetch all requests (both sent & received) for this user
    const [sentSnap, receivedSnap] = await Promise.all([
      db.collection("soloRequests").where("from", "==", userId).get(),
      db.collection("soloRequests").where("to", "==", userId).get(),
    ]);

    // Make a Set of all users already linked by request
    const excludedUsers = new Set();
    sentSnap.forEach(doc => {
      const reqData = doc.data();
      if (["pending", "accepted"].includes(reqData.status)) {
        excludedUsers.add(reqData.to);
      }
    });
    receivedSnap.forEach(doc => {
      const reqData = doc.data();
      if (["pending", "accepted"].includes(reqData.status)) {
        excludedUsers.add(reqData.from);
      }
    });

    // 2️⃣ Get all solo travellers
    const snapshot = await db.collection('users')
      .where('Issolo', '==', true)
      .get();

    if (snapshot.empty) {
      return res.json({ nearbyTravellers: [] });
    }

    // 3️⃣ Filter by 20 km radius and exclude already requested users
    const nearbyTravellers = [];
    snapshot.forEach(doc => {
      if (doc.id === userId) return; // skip self
      if (excludedUsers.has(doc.id)) return; // skip already requested/accepted users

      const data = doc.data();
      if (data.lastLocation?.latitude && data.lastLocation?.longitude) {
        const distance = getDistanceFromLatLonInKm(
          userLat, userLng,
          data.lastLocation.latitude, data.lastLocation.longitude
        );

        if (distance <= 20) {
          nearbyTravellers.push({
            id: doc.id,
            name: data.username,
            phone: data.phone,
            distance: Number(distance.toFixed(2))
          });
        }
      }
    });

    // 4️⃣ Return final result
    res.json({
      message: 'Nearby solo travellers within 20 km (excluding requested/accepted)',
      nearbyTravellers
    });

  } catch (err) {
    console.error('Error finding solo travellers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/see-groups', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // userId from token

    // 1. Find the user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // 2. Check if groups field exists
    if (!userData.groups || userData.groups.length === 0) {
      return res.json({ message: 'User is not in any groups', groups: [] });
    }

    // 3. Fetch all groups by their IDs (only groupId)
    const groupsData = [];
    for (const groupId of userData.groups) {
      const groupDoc = await db.collection('groups').doc(groupId).get();
      if (groupDoc.exists) {
        groupsData.push(groupDoc.id); // ✅ store only groupId
      }
    }

    // 4. Send response
    res.json({
      message: 'User groups fetched successfully',
      groups: groupsData
    });

  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// User A sends a request to User B
router.post("/send-solo-request", authenticateToken, async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user.id;

    if (!toUserId) return res.status(400).json({ error: "Missing toUserId" });

    // save request in Firestore
    await db.collection("soloRequests").add({
      from: fromUserId,
      to: toUserId,
      status: "pending",
      createdAt: new Date(),
    });

    // notify user B in real-time
    const socketId = global.onlineUsers?.get(toUserId);
    if (socketId) {
      req.io.to(socketId).emit("soloRequestReceived", {
        from: fromUserId,
        message: "You have a new solo request!",
      });
    }

    res.json({ message: "Request sent successfully" });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/accept-solo-request", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    const reqRef = db.collection("soloRequests").doc(requestId);
    const reqSnap = await reqRef.get();

    if (!reqSnap.exists) return res.status(404).json({ error: "Request not found" });

    const requestData = reqSnap.data();

    if (requestData.to !== userId) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }

    // update request status
    await reqRef.update({ status: "accepted" });

    // fetch both users contact
    const fromUserRef = db.collection("users").doc(requestData.from);
    const toUserRef = db.collection("users").doc(requestData.to);

    const [fromUserSnap, toUserSnap] = await Promise.all([fromUserRef.get(), toUserRef.get()]);
    const fromUser = fromUserSnap.data();
    const toUser = toUserSnap.data();

    // notify both users with contact info
    const fromSocket = global.onlineUsers?.get(requestData.from);
    if (fromSocket) {
      req.io.to(fromSocket).emit("soloRequestAccepted", {
        by: userId,
        contact: toUser.contact || "No number",
      });
    }

    const toSocket = global.onlineUsers?.get(requestData.to);
    if (toSocket) {
      req.io.to(toSocket).emit("soloRequestAccepted", {
        by: userId,
        contact: fromUser.contact || "No number",
      });
    }

    res.json({ message: "Request accepted", contactsShared: true });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/find_restaurants", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1️⃣ Fetch user doc
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    if (!userData.lastLocation || !userData.lastLocation.latitude || !userData.lastLocation.longitude) {
      return res.status(400).json({ error: "User location not available" });
    }

    const userLocation = {
      latitude: Number(userData.lastLocation.latitude),
      longitude: Number(userData.lastLocation.longitude),
    };

    // 2️⃣ Fetch all restaurants
    const snapshot = await db.collection("restaurants").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    const nearbyRestaurants = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.lat && data.lng) {
        const restaurantLocation = {
          latitude: Number(data.lat),
          longitude: Number(data.lng),
        };

        const distance = geolib.getDistance(userLocation, restaurantLocation); // meters

        if (distance <= 10000) { // within 10 km
          nearbyRestaurants.push({
            id: doc.id,
            ...data,
            distance: (distance / 1000).toFixed(2) + " km",
          });
        }
      }
    });

    // 3️⃣ Sort by distance (nearest first)
    nearbyRestaurants.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json({
      message: "Nearby restaurants fetched successfully",
      userLocation,
      restaurants: nearbyRestaurants,
    });

  } catch (err) {
    console.error("Error finding restaurants:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// 1️⃣ See all users to whom the logged-in user has sent requests
router.get("/my-sent-solo-requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const sentSnap = await db
      .collection("soloRequests")
      .where("from", "==", userId)
      .get();

    if (sentSnap.empty) {
      return res.json({ message: "No sent requests", sent: [] });
    }

    const sentRequests = sentSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().username,
      ...doc.data(),
    }));

    res.json({ message: "Fetched sent requests", sent: sentRequests });
  } catch (err) {
    console.error("Error fetching sent requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2️⃣ See all users who have sent requests to the logged-in user
router.get("/my-received-solo-requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const recvSnap = await db
      .collection("soloRequests")
      .where("to", "==", userId)
      .get();

    if (recvSnap.empty) {
      return res.json({ message: "No received requests", received: [] });
    }

    const receivedRequests = recvSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.username,
      ...doc.data(),
    }));

    res.json({ message: "Fetched received requests", received: receivedRequests });
  } catch (err) {
    console.error("Error fetching received requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/trigger-sos", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // 1️⃣ Fetch current user details
    const userSnap = await db.collection("users").doc(userId).get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = userSnap.data();

    // 2️⃣ Find all users (excluding self)
    const snapshot = await db.collection("users").get();
    const nearbyUsers = [];

    snapshot.forEach((doc) => {
      if (doc.id === userId) return; // skip self
      const data = doc.data();

      if (data.lastLocation?.latitude && data.lastLocation?.longitude) {
        const distance = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          data.lastLocation.latitude,
          data.lastLocation.longitude
        );

        if (distance <= 5) {
          nearbyUsers.push({ id: doc.id, name: data.username });
        }
      }
    });
    console.log(nearbyUsers);

    // 3️⃣ Emit SOS to nearby users
    nearbyUsers.forEach((user) => {
      console.log(`Checking socket for user ${user.name} (${user.id})`);
      const socketId = global.onlineUsers?.get(user.id);
      console.log(`Socket ID for user ${user.name} (${user.id}):`, socketId);
      if (socketId) {
        console.log(`Notifying ${user.name} (${user.id}) about SOS`);
        req.io.to(socketId).emit("sosAlert", {
          from: userData.name,
          userId,
          location: { latitude: userLat, longitude: userLng },
          message: `🚨 SOS Alert: ${userData.name} needs help nearby!`,
        });
      }
    });

    // 4️⃣ Save SOS in Firestore (optional, for history)
    await db.collection("sosAlerts").add({
      userId,
      location: { latitude: userLat, longitude: userLng },
      createdAt: new Date(),
      status: "active",
    });

    res.json({
      message: "SOS triggered successfully",
      notifiedUsers: nearbyUsers.map((u) => u.name),
    });
  } catch (err) {
    console.error("Error triggering SOS:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;