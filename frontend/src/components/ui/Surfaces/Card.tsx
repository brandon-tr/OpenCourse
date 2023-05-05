import React from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  centerTitle?: boolean;
};

function Card({
  title,
  subtitle,
  children,
  action,
  centerTitle = false,
}: CardProps) {
  const titleClass = centerTitle
    ? "text-2xl font-bold mb-6 text-center"
    : "text-2xl font-bold mb-6";

  return (
    <div className="bg-accent p-6 md:p-12 rounded-lg w-full">
      <h2 className={titleClass}>{title}</h2>
      {subtitle && <h3 className="text-lg font-bold mb-4">{subtitle}</h3>}
      <div className="mb-4">{children}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default Card;
