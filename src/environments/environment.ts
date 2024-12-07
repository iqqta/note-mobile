import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD2VHVNKEDKk69sCWGH2emUwDnRBQ1zIqw",
    authDomain: "note-d7ee4.firebaseapp.com",
    projectId: "note-d7ee4",
    storageBucket: "note-d7ee4.firebasestorage.app",
    messagingSenderId: "60330969235",
    appId: "1:60330969235:web:6b392844f4e589bab8a566"
  },
};

const firebase = initializeApp(environment.firebaseConfig);

const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };