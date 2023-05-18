import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCu_-Z1bebVV564ejTbj_V-4vnMyI8Lfps",
  authDomain: "fii-practic-f1ac2.firebaseapp.com",
  projectId: "fii-practic-f1ac2",
  storageBucket: "fii-practic-f1ac2.appspot.com",
  messagingSenderId: "518673841607",
  appId: "1:518673841607:web:7b51769c3bf6833df22de2",
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

export { auth, db, storage }
export default firebase
