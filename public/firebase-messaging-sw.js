importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyB_KhxNYbce33tuNUz_8_Ap3xEI1runpr8",
  authDomain: "lokpriya-taxi.firebaseapp.com",
  projectId: "lokpriya-taxi",
  storageBucket: "lokpriya-taxi.firebasestorage.app",
  messagingSenderId: "847007174688",
  appId: "1:847007174688:web:fc56bd7d2f22ded7932c45",
  measurementId: "G-7LSX7ZFVXT",
});

const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  DRIVER_ASSIGNED: "DRIVER_ASSIGNED",
  TRIP_STARTED: "TRIP_STARTED",
  TRIP_COMPLETED: "TRIP_COMPLETED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  NEW_BOOKING: "NEW_BOOKING",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  DEFAULT: "DEFAULT",
};

const NOTIFICATION_URLS = {
  [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: "/bookings",
  [NOTIFICATION_TYPES.DRIVER_ASSIGNED]: "/bookings",
  [NOTIFICATION_TYPES.TRIP_STARTED]: "/bookings",
  [NOTIFICATION_TYPES.TRIP_COMPLETED]: "/bookings",
  [NOTIFICATION_TYPES.BOOKING_CANCELLED]: "/bookings",
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: "/bookings",
  [NOTIFICATION_TYPES.NEW_BOOKING]: "/admin/bookings",
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: "/admin/bookings",
  [NOTIFICATION_TYPES.DEFAULT]: "/",
};

const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.BOOKING_CONFIRMED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.DRIVER_ASSIGNED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.TRIP_STARTED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.TRIP_COMPLETED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.BOOKING_CANCELLED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.NEW_BOOKING]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: "/pwa/icon-192.png",
  [NOTIFICATION_TYPES.DEFAULT]: "/pwa/icon-192.png",
};

const getNotificationUrl = (data) => {
  if (data?.url) return data.url;
  if (data?.type && NOTIFICATION_URLS[data.type]) {
    return NOTIFICATION_URLS[data.type];
  }
  return NOTIFICATION_URLS[NOTIFICATION_TYPES.DEFAULT];
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationType = payload.data?.type || NOTIFICATION_TYPES.DEFAULT;
  const notificationTitle = payload.notification?.title || "Popular Rides";
  const notificationUrl =
    payload.fcmOptions?.link || getNotificationUrl(payload.data);

  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: NOTIFICATION_ICONS[notificationType],
    badge: "/pwa/icon-192.png",
    data: { url: notificationUrl },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = getNotificationUrl(event.notification.data) || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      }),
  );
});
