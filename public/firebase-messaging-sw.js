importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDvcY8lVb7xK1sjAv6c1R9ygrtskDksOHc",
  authDomain: "unicare-eedf9.firebaseapp.com",
  projectId: "unicare-eedf9",
  storageBucket: "unicare-eedf9.appspot.com",
  messagingSenderId: "71770612056",
  appId: "1:71770612056:web:27e64a5c50d1438648c52d",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const channel = new BroadcastChannel("fcm-channel");

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // broadcast this message to foreground
  channel.postMessage(payload);
});
