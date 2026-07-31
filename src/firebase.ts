import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsG0Rd7N0OVh90kzG3L2UGClGZqNHBhLc",
  authDomain: "omii-65d7e.firebaseapp.com",
  projectId: "omii-65d7e",
  storageBucket: "omii-65d7e.firebasestorage.app",
  messagingSenderId: "49441988870",
  appId: "1:49441988870:web:2a896ca35737c33655fe87",
  measurementId: "G-WH0CCQ7L5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (safely initialized for browser environments)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
