"use client";

import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB_KhxNYbce33tuNUz_8_Ap3xEI1runpr8",
  authDomain: "lokpriya-taxi.firebaseapp.com",
  projectId: "lokpriya-taxi",
  storageBucket: "lokpriya-taxi.firebasestorage.app",
  messagingSenderId: "847007174688",
  appId: "1:847007174688:web:fc56bd7d2f22ded7932c45",
  measurementId: "G-7LSX7ZFVXT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const messaging = () =>
  typeof window !== "undefined" ? getMessaging(app) : null;
