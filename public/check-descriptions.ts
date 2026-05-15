import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../firebase-applet-config.json";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

async function check() {
  const snapshot = await db.collection("services").get();
  console.log(`Checking ${snapshot.size} services...`);
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`Service: ${data.name}`);
    console.log(`Description: ${String(data.description).substring(0, 50)}...`);
  });
}

check().catch(console.error);
