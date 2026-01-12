import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔥 ADD THIS BELOW root.render (VERY IMPORTANT)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("FCM Service Worker registered:", registration);
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  });
}

// Performance measurement (optional)
reportWebVitals();
