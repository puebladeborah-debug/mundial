import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// La apiKey de Firebase no es secreta: el acceso real se controla con las
// reglas de seguridad de Firestore, no escondiendo esta configuración.
const firebaseConfig = {
  apiKey: "AIzaSyCqFqWPCngkzdkF3vrn_7FNc-Fx_dC4NCQ",
  authDomain: "mundial-d17a2.firebaseapp.com",
  projectId: "mundial-d17a2",
  storageBucket: "mundial-d17a2.firebasestorage.app",
  messagingSenderId: "592242527876",
  appId: "1:592242527876:web:0131f5afe962325bbe3cd1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
