// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getFirestore, 
          collection, 
          addDoc,
          setDoc,
          doc, 
          where, 
          query, 
          getDocs 
} from "firebase/firestore"

import {
          GoogleAuthProvider,
          getAuth,
          signInWithPopup,
          signInWithEmailAndPassword,
          createUserWithEmailAndPassword,
          sendPasswordResetEmail,
          signOut,
          updateProfile,
}from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7Y0pW50UQD-f0-xV-S1dk-JzolYh0nxQ",
  authDomain: "todo-list-67f2c.firebaseapp.com",
  projectId: "todo-list-67f2c",
  storageBucket: "todo-list-67f2c.appspot.com",
  messagingSenderId: "1093337449368",
  appId: "1:1093337449368:web:3e28e82f5c3ac5305861ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });

      await setDoc(doc(db, "individual-todos", user.email), {
        task: [
                {
                  uid: 0,
                  completed: false,
                  title: "Sample Task"
                }
        ]
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const loginInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, {
      displayName: name
    });
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });

    await setDoc(doc(db, "individual-todos", email), {
      task: [
              {
                uid: 0,
                completed: false,
                title: "Sample Task"
              }
      ]
    });

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(getAuth())
};

export {
  auth,
  db,
  signInWithGoogle,
  loginInWithEmailAndPassword,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};