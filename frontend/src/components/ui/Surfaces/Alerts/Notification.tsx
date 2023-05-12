"use client";

import React, { useEffect } from "react";
import { useUiStore } from "@/components/store/Store";
import getClassNames from "@/components/utility/GetClassNames";
import { useSearchParams } from "next/navigation";

const Notification: React.FC = () => {
  const params = useSearchParams();
  const { notification, showNotification, hideNotification } = useUiStore(
    (state) => ({
      notification: state.notification,
      showNotification: state.showNotification,
      hideNotification: state.hideNotification,
    })
  );

  useEffect(() => {
    if (params.has("errors")) {
      switch (params.get("errors")) {
        case process.env.NEXT_PUBLIC_ERRORS_UNAUTHORIZED:
          showNotification(
            "You are not authorized to view this page.",
            "error"
          );
          break;
        case process.env.NEXT_PUBLIC_ERRORS_NOT_LOGGED_IN:
          showNotification("You are not logged in.", "error");
          break;
        default:
          showNotification(
            "An unknown error has occurred. Please try again later.",
            "error"
          );
      }
    }
  }, [params, showNotification]);

  useEffect(() => {
    if (notification.active) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification.active, hideNotification]);

  const baseStyle =
    "rounded-md px-4 py-3 text-sm font-medium transition-opacity duration-300";
  const notificationStyle = getClassNames(
    baseStyle,
    [
      notification.severity === "success" && "bg-green-100 text-green-800",
      notification.severity === "info" && "bg-blue-100 text-blue-800",
      notification.severity === "warning" && "bg-yellow-100 text-yellow-800",
      notification.severity === "error" && "bg-red-100 text-red-800",
      notification.active ? "opacity-100" : "opacity-0",
    ]
      .filter(Boolean)
      .join(" ")
  );

  return (
    <div
      className={`fixed top-16 right-4 z-50 w-auto max-w-sm ${notificationStyle}`}
      role="status"
    >
      {notification.message}
    </div>
  );
};

export default Notification;
