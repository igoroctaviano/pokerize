import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration for GuessOps planning poker app
const firebaseConfig = {
  apiKey: "AIzaSyCEHom4DxjDq-2ZCUBwN-RTCoqn5ANYgaQ",
  authDomain: "pokerize-app.firebaseapp.com",
  projectId: "pokerize-app",
  storageBucket: "pokerize-app.firebasestorage.app",
  messagingSenderId: "333202499897",
  appId: "1:333202499897:web:3139dacbd2aaa2a1c360e8"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

console.log('Firebase initialized with project:', firebaseConfig.projectId)
