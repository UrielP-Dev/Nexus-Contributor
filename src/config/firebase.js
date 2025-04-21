import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyCZ9UjivhgYgRsLkQxZ-bCDStdtnFSNv80",
    authDomain: "nexus-b7be0.firebaseapp.com",
    projectId: "nexus-b7be0",
    storageBucket: "nexus-b7be0.firebasestorage.app",
    messagingSenderId: "622248450549",
    appId: "1:622248450549:web:0424be8959a4918d9c28bc"
};

// Inicializa Firebase solo si no hay una instancia existente
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializa Firestore
const db = getFirestore(app);

export { app, auth, db };
