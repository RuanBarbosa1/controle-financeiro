import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlwS7UpPzezTlypz7DJO2l-WevpfgtHHA",
  authDomain: "controle-financeiro-6ba61.firebaseapp.com",
  projectId: "controle-financeiro-6ba61",
  storageBucket: "controle-financeiro-6ba61.firebasestorage.app",
  messagingSenderId: "891070631343",
  appId: "1:891070631343:web:016f01c7b71c066ad0335a",
  measurementId: "G-YB0Q19FCME"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
