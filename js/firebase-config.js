// ============================================================
// FÓRMULA DO EGO — Configuração do Firebase
// ============================================================
// IMPORTANTE: Substitua os valores abaixo pelas credenciais do
// SEU projeto Firebase. Crie um projeto gratuito em:
// https://console.firebase.google.com
// Depois ative: Authentication (método "Anônimo") e Firestore Database.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  deleteField,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnDtloed2pYAkswf9wsoxNdY5ZotcOatI",
  authDomain: "formuladoego.firebaseapp.com",
  projectId: "formuladoego",
  storageBucket: "formuladoego.firebasestorage.app",
  messagingSenderId: "247657479058",
  appId: "1:247657479058:web:3d137e2726cab148f0df4b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Garante que sempre há um usuário (anônimo) autenticado.
// Retorna uma Promise que resolve com o usuário.
function garantirLogin() {
  console.log("[DEBUG] garantirLogin() chamado");
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      console.log("[DEBUG] onAuthStateChanged disparou. user =", user);
      if (user) {
        console.log("[DEBUG] já havia usuário, resolvendo direto");
        resolve(user);
      } else {
        console.log("[DEBUG] sem usuário, chamando signInAnonymously...");
        signInAnonymously(auth)
          .then((cred) => {
            console.log("[DEBUG] signInAnonymously SUCESSO. uid =", cred.user.uid);
            resolve(cred.user);
          })
          .catch((err) => {
            console.error("[DEBUG] signInAnonymously ERRO:", err.code, err.message);
            reject(err);
          });
      }
    }, (err) => {
      console.error("[DEBUG] onAuthStateChanged ERRO:", err);
    });
  });
}

export {
  app, auth, db,
  garantirLogin, updateProfile,
  doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot,
  collection, query, where, addDoc, serverTimestamp,
  arrayUnion, arrayRemove, deleteField, getDocs
};
