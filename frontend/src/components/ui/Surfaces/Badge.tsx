import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  text: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  text,
  position = "top-right",
  color = "primary",
  className = "",
}) => {
  const colorClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
  };

  const positionClasses = {
    "top-left": "top-0 left-0 -mt-3 -ml-3",
    "top-right": "top-0 right-0 -mt-3 -mr-3",
    "bottom-left": "bottom-0 left-0 -mb-3 -ml-3",
    "bottom-right": "bottom-0 right-0 -mb-3 -mr-3",
  };

  return (
    <div className="relative inline-block">
      {children}
      <span
        className={`absolute inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium leading-none ${colorClasses[color]} ${positionClasses[position]} ${className}`}
      >
        {text}
      </span>
    </div>
  );
};

export default Badge;
