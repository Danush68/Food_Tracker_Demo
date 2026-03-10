// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
    apiKey: "AIzaSyAzCJk9yrxQWp4yXVXXEi7_NH_LEK0lVEc",
    authDomain: "food-tracker-5b8cb.firebaseapp.com",
    projectId: "food-tracker-5b8cb",
    storageBucket: "food-tracker-5b8cb.firebasestorage.app",
    messagingSenderId: "116520771095",
    appId: "1:116520771095:web:6770977732836ea19ec652"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();