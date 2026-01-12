importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD2i06_--pnL-02fSmAlzc6cfcqi6clyDo",
  authDomain: "yummysouth-e9cef.firebaseapp.com",
  projectId: "yummysouth-e9cef",
  messagingSenderId: "829848572988",
  appId: "1:829848572988:web:541ae68f218475300b5f39",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
