import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyB4rU2g45dQS0HXAnEvx0mkD4zVr8i9yws",
    authDomain: "vanillajscrud-b7989.firebaseapp.com",
    databaseURL: "https://vanillajscrud-b7989-default-rtdb.firebaseio.com/",
    projectId: "vanillajscrud-b7989",
    storageBucket: "vanillajscrud-b7989.appspot.com",
    messagingSenderId: "277305471831",
    appId: "1:277305471831:web:1c54633cf77ef746230412"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { firebaseConfig }