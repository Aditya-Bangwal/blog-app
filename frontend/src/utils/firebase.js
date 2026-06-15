// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAff2PZ3i01iczgY5NFEnQpLtZxw_osrU",
  authDomain: "blogapp-66d6c.firebaseapp.com",
  projectId: "blogapp-66d6c",
  storageBucket: "blogapp-66d6c.firebasestorage.app",
  messagingSenderId: "977448589040",
  appId: "1:977448589040:web:871f0c9ea4cf3319f39435"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export async function googleAuth()
{
try {
    const result = await signInWithPopup(auth, provider);
  const accessToken = await result.user.getIdToken();
  return {
    accessToken,
    user: result.user,
  };
} catch (error) {
        console.log(error)
        
    }
}