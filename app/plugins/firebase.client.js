import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database' // ต้องมีบรรทัดนี้

export default defineNuxtPlugin(() => {
 const firebaseConfig = {
      apiKey: "AIzaSyDuCQ610cXSMPZHuwfbH-gE0jYdASgyzvc",
      authDomain: "test-firebase-and-nuxt-48a4d.firebaseapp.com",
      projectId: "test-firebase-and-nuxt-48a4d",
      storageBucket: "test-firebase-and-nuxt-48a4d.firebasestorage.app",
      messagingSenderId: "1064226263634",
      appId: "1:1064226263634:web:238fb1db1fa5f413ecc58b",
      measurementId: "G-1H9P5EBHC6"
      };

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const rtdb = getDatabase(app) // ต้องมีบรรทัดนี้

  return {
    provide: {
      firebase: app,
      db: db,
      rtdb: rtdb // ต้องมีบรรทัดนี้
    }
  }
})