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
          "w-full md:max-w-md lg:max-w-screen-xl p-4 rounded-md",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;
