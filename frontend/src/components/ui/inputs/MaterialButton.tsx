interface MaterialButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "small" | "medium" | "large" | "full";
    spacingTop?: number;
    spacingBottom?: number;
    rounded?: boolean;
    color?: "primary" | "secondary" | "danger" | "warning" | "white"; // Add this line
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
        primary: "bg-primary-light hover:bg-green-700 text-white",
        secondary: "bg-secondary hover:bg-green-700 text-white",
        danger: "bg-danger hover:bg-red-700 text-white",
        warning: "bg-warning hover:bg-yellow-700 text-white",
        white: "bg-white hover:bg-gray-200 text-gray-900",
    };

    const style = {
        marginTop: `${spacingTop * 0.25}rem`,
        marginBottom: `${spacingBottom * 0.25}rem`,
        borderRadius: rounded ? "999px" : "4px",
    };

    return (
        <button
            className={`${colorClasses[color]} font-semibold ${sizeClasses[size]}`} // Modify this line
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};

export default MaterialButton;
