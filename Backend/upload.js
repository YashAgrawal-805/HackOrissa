const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id, // ensure project ID is set
});

const db = admin.firestore();

const restaurants = JSON.parse(fs.readFileSync("data.json", "utf8"));

async function uploadData() {
  try {
    for (const restaurant of restaurants) {
      await db.collection("restaurants").doc(restaurant.place_id).set(restaurant);
      console.log(`✅ Uploaded: ${restaurant.name}`);
    }
    console.log("🎉 All data uploaded successfully!");
  } catch (err) {
    console.error("❌ Error uploading data:", err);
  }
}

uploadData();
