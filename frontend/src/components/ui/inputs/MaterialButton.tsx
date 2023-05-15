interface MaterialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large" | "full";
  spacingTop?: number;
  spacingBottom?: number;
  rounded?: boolean;
  color?: "primary" | "secondary" | "danger"; // Add this line
}

const MaterialButton: React.FC<MaterialButtonProps> = ({
  size = "medium",
  spacingTop = 0,
  spacingBottom = 0,
  rounded = false,
  color = "primary", // Add this line
  children,
  ...props
}) => {
  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
    full: "py-2 px-4 text-base w-full",
  };

  const colorClasses = {
    // Add this block
    primary: "bg-primary-light hover:bg-green-700",
    secondary: "bg-secondary hover:bg-green-700",
    danger: "bg-danger hover:bg-red-700",
  };

  const style = {
    marginTop: `${spacingTop * 0.25}rem`,
    marginBottom: `${spacingBottom * 0.25}rem`,
    borderRadius: rounded ? "999px" : "4px",
  };

  return (
    <button
      className={`${colorClasses[color]} text-white font-semibold ${sizeClasses[size]}`} // Modify this line
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default MaterialButton;
