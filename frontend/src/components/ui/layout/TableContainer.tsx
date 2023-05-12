import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return (
    <div className="sm:w-screen sm:max-w-screen-sm lg:w-screen lg:max-w-screen-lg">
      {children}
    </div>
  );
};

export default TableContainer;
