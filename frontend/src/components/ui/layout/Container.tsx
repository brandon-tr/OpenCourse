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
  return (
    <div
      className={getClassNames(
        centered ? "flex justify-center mt-3 flex-grow" : "mt-3 flex-grow",
        className
      )}
      {...restProps}
    >
      <div
        className={getClassNames(
          "w-full max-w-screen-md p-4 shadow-md rounded-md",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;
