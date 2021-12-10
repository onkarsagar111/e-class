// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkGv9IaLcADlsf_j436ScP_VhPA5tFZm4",
  authDomain: "e-class-40901.firebaseapp.com",
  databaseURL: "https://e-class-40901-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-class-40901",
  storageBucket: "e-class-40901.appspot.com",
  messagingSenderId: "1001723430875",
  appId: "1:1001723430875:web:575220d23590232cef89fe"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
export default fire;