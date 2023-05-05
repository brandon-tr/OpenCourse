import React from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Avatar;
