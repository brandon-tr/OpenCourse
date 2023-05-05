import React from "react";

interface CenteredLayoutProps {
  children: React.ReactNode;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center mt-3 flex-grow">
      <div className="w-full max-w-screen-md p-4 shadow-md rounded-md">
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;
