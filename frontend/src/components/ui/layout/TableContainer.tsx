import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return <div className="max-w-screen-xl">{children}</div>;
};

export default TableContainer;
