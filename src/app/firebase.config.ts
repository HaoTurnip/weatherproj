import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyD91QaqZK0vGKiVKFZR-D4n3sOgiaMaViw",
  authDomain: "weather-app-318f1.firebaseapp.com",
  projectId: "weather-app-318f1",
  storageBucket: "weather-app-318f1.firebasestorage.app",
  messagingSenderId: "908548201096",
  appId: "1:908548201096:web:8b41f7bb69b06987c69d3d",
  measurementId: "G-7MJEXSV6DZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

export default app; 