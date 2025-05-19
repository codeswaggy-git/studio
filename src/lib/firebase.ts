
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Critical check for essential Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
  const missingKeys = [];
  if (!firebaseConfig.apiKey) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.projectId) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.authDomain) missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");

  const errorMessage =
    `FIREBASE_CONFIG_ERROR: Critical Firebase configuration is missing. ` +
    `Please ensure the following environment variables are correctly set in your .env file (in the project root) and the server has been restarted: ` +
    missingKeys.join(", ") + ". " +
    `Current values (may be undefined) - apiKey: ${firebaseConfig.apiKey}, projectId: ${firebaseConfig.projectId}, authDomain: ${firebaseConfig.authDomain}`;

  console.error(errorMessage);
  // Throwing an error here will make the issue more visible than just a console log,
  // especially if it's causing an "Internal Server Error".
  throw new Error(errorMessage);
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error: any) {
    const initErrorMessage = `Firebase initialization failed: ${error.message}. Check your Firebase project settings and .env file. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correct.`;
    console.error(initErrorMessage, "Config used:", firebaseConfig);
    throw new Error(initErrorMessage);
  }
} else {
  app = getApp();
}

try {
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error: any) {
  const serviceErrorMessage = `Failed to get Firebase services (Auth/Firestore): ${error.message}. This usually indicates an issue with Firebase app initialization.`;
  console.error(serviceErrorMessage);
  throw new Error(serviceErrorMessage);
}

export { app, auth, db };
