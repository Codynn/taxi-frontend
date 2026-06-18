"use client";
import { useEffect, useRef } from "react";
import { getToken, isSupported, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { toast } from "sonner";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_URLS,
  NOTIFICATION_SOUNDS,
  NotificationType,
} from "@/constants/notification.constants";
import { useSaveFcmToken } from "@/lib/api/notification.api";

interface NotificationPayload {
  title: string;
  body: string;
  type?: string;
  data?: any;
  url?: string;
}

const getNotificationUrl = (payload: NotificationPayload): string => {
  if (payload.url) return payload.url;
  if (payload.data?.url) return payload.data.url;
  if (
    payload.data?.type &&
    NOTIFICATION_URLS[payload.data.type as NotificationType]
  ) {
    return NOTIFICATION_URLS[payload.data.type as NotificationType];
  }
  return NOTIFICATION_URLS[NOTIFICATION_TYPES.DEFAULT];
};

export function useFCM() {
  const { mutate: saveFcmToken } = useSaveFcmToken();
  const tokenSavedRef = useRef(false);

  const showInAppNotification = (payload: NotificationPayload) => {
    const url = getNotificationUrl(payload);

    const toastOptions = {
      description: payload.body,
      duration: 5000,
      position: "top-right" as const,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = url;
        },
      },
    };

    if (payload.type === "error") {
      toast.error(payload.title, toastOptions);
    } else if (payload.type === "success") {
      toast.success(payload.title, toastOptions);
    } else {
      toast.info(payload.title, toastOptions);
    }
  };

  const setupForegroundListener = async () => {
    const supported = await isSupported();
    if (!supported) return;

    const msg = messaging();
    if (!msg) return;

    const unsubscribe = onMessage(msg, (payload: any) => {
      const notificationTitle = payload?.notification?.title || "Popular Rides";
      const notificationBody = payload?.notification?.body || "";
      const notificationType =
        (payload?.data?.type as NotificationType) || NOTIFICATION_TYPES.DEFAULT;

      showInAppNotification({
        title: notificationTitle,
        body: notificationBody,
        type: notificationType,
        data: payload.data,
      });

      new Audio(NOTIFICATION_SOUNDS[notificationType])?.play();
    });

    return unsubscribe;
  };

  const registerFCM = async () => {
    try {
      const supported = await isSupported();
      // console.log("FCM supported:", supported);
      if (!supported) return;

      console.log("Notification permission:", Notification.permission);
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      // console.log("Permission result:", permission);
      if (permission !== "granted") return;

      const msg = messaging();
      // console.log("Messaging instance:", msg);
      if (!msg) return;

      const token = await getToken(msg, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      // console.log("FCM Token:", token);

      if (token && !tokenSavedRef.current) {
        saveFcmToken(token, {
          onSuccess: () => {
            tokenSavedRef.current = true;
            console.log("Token saved successfully");
          },
          onError: (err: any) => {
            console.error("FCM token save error:", err);
          },
        });
      }
    } catch (error) {
      console.error("FCM registration error:", error);
    }
  };

  const handleTokenRefresh = async () => {
    try {
      const supported = await isSupported();
      if (!supported) return;

      const msg = messaging();
      if (!msg) return;

      const token = await getToken(msg, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token && tokenSavedRef.current) {
        saveFcmToken(token);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  };

  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let refreshInterval: ReturnType<typeof setInterval>;

    const init = async () => {
      await registerFCM();
      unsubscribeForeground = await setupForegroundListener();
      refreshInterval = setInterval(
        handleTokenRefresh,
        7 * 24 * 60 * 60 * 1000,
      );
    };

    init();

    return () => {
      unsubscribeForeground?.();
      clearInterval(refreshInterval);
    };
  }, []);
}
