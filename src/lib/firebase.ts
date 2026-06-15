"use client";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBYz9ksr9ygeOp21d3vJrKzk4SVvPiacz4",
  authDomain: "dajubhai-pharmacy.firebaseapp.com",
  projectId: "dajubhai-pharmacy",
  storageBucket: "dajubhai-pharmacy.firebasestorage.app",
  messagingSenderId: "983144341500",
  appId: "1:983144341500:web:f97fd3a1c83c0c88bc1c79",
  measurementId: "G-VS501K0N26",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const messaging = () =>
  typeof window !== "undefined" ? getMessaging(app) : null;
