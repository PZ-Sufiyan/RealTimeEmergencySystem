importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
