import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL54dpuG_BEDdb44elMbDovt8lfcnwjQM",
  authDomain: "kushie-b69fb.firebaseapp.com",
  databaseURL: "https://kushie-b69fb-default-rtdb.firebaseio.com",
  projectId: "kushie-b69fb",
  storageBucket: "kushie-b69fb.firebasestorage.app",
  messagingSenderId: "435782528441",
  appId: "1:435782528441:web:0d581c6ece646e27d85a68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase: App initialized with config:', firebaseConfig);

// Initialize services
export const database = getDatabase(app);
console.log('Firebase: Realtime Database initialized');

export const db = database; // Keep db export for backward compatibility
export const storage = getStorage(app);

export default app;