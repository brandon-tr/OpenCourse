import React from "react";

interface MaterialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large" | "full";
  spacingTop?: number;
  spacingBottom?: number;
}

const MaterialButton: React.FC<MaterialButtonProps> = ({
  size = "medium",
  spacingTop = 0,
  spacingBottom = 0,
  children,
  ...props
}) => {
  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
    full: "py-2 px-4 text-base w-full",
  };

  const style = {
    marginTop: `${spacingTop * 0.25}rem`,
    marginBottom: `${spacingBottom * 0.25}rem`,
  };

  return (
    <button
      className={`bg-primary-light hover:bg-green-700 text-white font-semibold rounded ${sizeClasses[size]}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default MaterialButton;
