
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore" // <- 🔥 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyAqrMyz3Kr2XWmoR6kYL_vkrzkoSdihUoA",
  authDomain: "fruver-a0a0f.firebaseapp.com",
  projectId: "fruver-a0a0f",
  storageBucket: "fruver-a0a0f.appspot.com",
  messagingSenderId: "900197236815",
  appId: "1:900197236815:web:47108368e4b074b5442a3a",
  measurementId: "G-9LXK6YWLMJ"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

let analytics: ReturnType<typeof getAnalytics> | undefined
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

const auth = getAuth(app)
const db = getFirestore(app) // <- 🔥 AÑADIR FIRESTORE

export { app, analytics, auth, db } // <- 🔥 EXPORTARLO
