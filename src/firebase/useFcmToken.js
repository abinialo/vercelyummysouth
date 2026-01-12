import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const getFcmToken = async () => {
  try {
    console.log(" Requesting notification permission...");

    const permission = await Notification.requestPermission();
    console.log(" Permission:", permission);

    if (permission !== "granted") {
      console.warn(" Notification permission denied");
      return null;
    }

   
    const registration = await navigator.serviceWorker.ready;
    console.log(" SW Ready:", registration);


    const token = await getToken(messaging, {
      vapidKey:
        "BD_AeWyGZ1mrXq5VX2yaKeqRkoge4GWYvjBEZgm2bCmG29AGesn5NGg5owkV5qCpAoG1KfjyTuvvvM8sLrGcCMY",
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn(" FCM token is NULL");
      return null;
    }

    console.log(" FCM TOKEN VALUE:", token);
    return token;

  } catch (error) {
    console.error(" FCM token error:", error);
    return null;
  }
};
