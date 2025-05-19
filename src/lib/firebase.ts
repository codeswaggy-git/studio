
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Log raw environment variable presence early
console.log(
  "Firebase module evaluating. Status of critical environment variables (check your .env file in the project root and ensure server is restarted after changes):",
  {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "SET (value hidden)" : "NOT SET or empty",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "SET (value hidden)" : "NOT SET or empty",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "SET (value hidden)" : "NOT SET or empty",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "SET (value hidden)" : "NOT SET or empty",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "SET (value hidden)" : "NOT SET or empty",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "SET (value hidden)" : "NOT SET or empty",
  }
);

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
    `Review the server console logs for 'Firebase module evaluating' to see current perceived values.`;

  console.error(errorMessage);
  // Log the actual (potentially partial) config for debugging
  console.error("Problematic firebaseConfig object:", JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED" : value));
  throw new Error(errorMessage);
}

// Log the configuration that will be used for initialization
// WARNING: Be careful with logging sensitive information like API keys in production.
// For debugging, this shows the actual values being passed.
console.log("Firebase effective configuration to be used for initialization (ensure these exact values match your Firebase project settings):", JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED" : value));

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  try {
    console.log("Attempting to initialize new Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log(`Firebase app "${app.name}" initialized successfully.`);
  } catch (error: any) {
    const initErrorMessage = `Firebase initialization failed: ${error.message}. Check your Firebase project settings and .env file. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correct. Config used for initialization attempt: ${JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED" : value)}`;
    console.error(initErrorMessage);
    throw new Error(initErrorMessage);
  }
} else {
  app = getApp();
  console.log(`Using existing Firebase app: "${app.name}".`);
}

try {
  console.log(`Attempting to get Firebase Auth service for app: "${app.name}"...`);
  auth = getAuth(app); // This is where auth/configuration-not-found typically occurs
  console.log("Firebase Auth service obtained successfully.");
  
  console.log(`Attempting to get Firebase Firestore service for app: "${app.name}"...`);
  db = getFirestore(app);
  console.log("Firebase Firestore service obtained successfully.");
} catch (error: any) {
  // Log the specific error and the config used
  const serviceErrorMessage = `Failed to get Firebase services (Auth/Firestore): ${error.message}. This often indicates an issue with Firebase app initialization or incorrect configuration values in your .env file. Ensure these values exactly match your Firebase project settings. App name: ${app?.name}. Config used at initialization: ${JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED" : value)}`;
  console.error(serviceErrorMessage);
  console.error("Original error object:", error); // Log the original error for more details
  throw new Error(serviceErrorMessage);
}

export { app, auth, db };
