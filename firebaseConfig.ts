import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDCncdjZnx17Yj1hT9N7STdt2rRbQsosK0",
  authDomain: "splitmates-mobile.firebaseapp.com",
  projectId: "splitmates-mobile",
  storageBucket: "splitmates-mobile.firebasestorage.app",
  messagingSenderId: "117445920994",
  appId: "1:117445920994:web:6118239260f4f7eddb36bb",
};

const app = initializeApp(firebaseConfig);

let auth: any;

if (Platform.OS === "web") {
  auth = initializeAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
export { app, auth };
