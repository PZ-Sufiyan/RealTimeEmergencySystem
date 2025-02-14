import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDOGSg0hs8_gZGsbI_RpgYnzPcKc-z4IZA",
    authDomain: "elisasentry.firebaseapp.com",
    databaseURL: "https://elisasentry-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "elisasentry",
    storageBucket: "elisasentry.firebasestorage.app",
    messagingSenderId: "187502890975",
    appId: "1:187502890975:web:9e9462870c5771654c7e6a",
    measurementId: "G-R3BDSBJGLD"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const token = await getToken(messaging, {
        vapidKey: "BHu8fQcjA23VCvotZp0p8gywEoQn152M-5e1gRKAm3raSk1Nz82Zs5pvGxLvCbySakSNAIxVVPp0sz_W-TfSpuU",
        serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"),
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};

onMessage(messaging, (payload) => {
  console.log("Message received: ", payload);
});

