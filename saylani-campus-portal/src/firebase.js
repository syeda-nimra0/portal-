import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these values with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyAzYFJY6zsixycmd7X6QqQssMBC-YK12nY",
  authDomain: "dashboard-37136.firebaseapp.com",
  projectId: "dashboard-37136",
  storageBucket: "dashboard-37136.firebasestorage.app",
  messagingSenderId: "59123932151",
  appId: "1:59123932151:web:1c70f8c6aea56e3fcaecf2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
