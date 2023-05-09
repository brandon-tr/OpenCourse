import React, { useEffect } from "react";
import { useUiStore } from "@/components/store/Store";
import getClassNames from "@/components/utility/GetClassNames";

interface AlertProps {
  alwaysShow?: boolean;
  disableFixed?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  alwaysShow = false,
  disableFixed = true,
}) => {
  const { alert, hideAlert } = useUiStore((state) => ({
    alert: state.alert,
    hideAlert: state.hideAlert,
  }));

  useEffect(() => {
    if (alert.active && !alwaysShow) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.active, hideAlert, alwaysShow]);

  const baseStyle =
    "rounded-md px-4 py-3 text-sm font-medium transition-opacity duration-300";
  const alertStyle = getClassNames(
    baseStyle,
    [
      alert.severity === "success" && "bg-green-100 text-green-800",
      alert.severity === "info" && "bg-blue-100 text-blue-800",
      alert.severity === "warning" && "bg-yellow-100 text-yellow-800",
      alert.severity === "error" && "bg-red-100 text-red-800",
      alert.active ? "opacity-100" : "opacity-0",
    ]
      .filter(Boolean)
      .join(" ")
  );

  const positioningStyle = disableFixed
    ? "block w-full"
    : "fixed top-16 right-4 z-50 w-auto max-w-sm";

  return (
    <div className={`${positioningStyle}  ${alertStyle} mt-2`} role="alert">
      {alert.message}
    </div>
  );
};

export default Alert;
