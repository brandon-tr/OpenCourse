// components/HorizontalLine.tsx
import React, { HTMLAttributes } from "react";

interface HorizontalLineProps extends HTMLAttributes<HTMLElement> {
  thickness?: number;
  color?: string;
  margin?: string;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({
  thickness = 1,
  color = "#747373",
  margin = "16px 0",
  className,
  ...otherProps
}) => {
  return (
    <hr
      style={{
        border: 0,
        borderTop: `${thickness}px solid ${color}`,
        margin: margin,
        width: "100%",
      }}
      {...otherProps}
    />
  );
};

export default HorizontalLine;
