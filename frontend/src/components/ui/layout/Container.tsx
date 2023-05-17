import React from "react";
import getClassNames from "@/components/utility/GetClassNames";

interface CenteredLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  centered?: boolean;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  centered = true,
  className,
  ...restProps
}) => {
  const centeredChild = centered ? "lg:max-w-lg" : "w-full md:max-w-md";
  return (
    <div
      className={getClassNames(
        centered ? "lg:flex lg:justify-center" : "mt-3 flex-grow",
        className
      )}
      {...restProps}
    >
      <div
        className={getClassNames(`${centeredChild} p-4 rounded-md`, className)}
      >
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;
