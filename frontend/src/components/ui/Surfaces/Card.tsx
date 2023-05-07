import React from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  centerTitle?: boolean;
  removeBg?: boolean;
  bgColor?: string;
};

function Card({
  title,
  subtitle,
  children,
  action,
  centerTitle = false,
  removeBg = false,
  bgColor,
}: CardProps) {
  const titleClass = centerTitle
    ? "text-2xl font-bold mb-6 text-center"
    : "text-2xl font-bold mb-6";

  if (removeBg && bgColor) {
    throw new Error("Cannot pass both removeBg and bgColor props");
  }

  const bgClass = removeBg ? "" : bgColor ? `bg-${bgColor}` : "bg-accent";

  return (
    <div className={`p-6 md:p-12 rounded-lg w-full ${bgClass}`}>
      <h2 className={titleClass}>{title}</h2>
      {subtitle && <h3 className="text-lg font-bold mb-4">{subtitle}</h3>}
      <div className="mb-4">{children}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default Card;
