import React from "react";
import {FieldError, UseFormRegister} from "react-hook-form";

interface TextAreaInputProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    register: UseFormRegister<any>;
    name: string;
    required?: boolean;
    validationOptions?: any;
    error?: FieldError;
    errorTextColor?: string;
    errorBgColor?: string;
    errorBorderColor?: string;
    id: string;
}

const TextAreaFormInput: React.FC<TextAreaInputProps> = ({
                                                             label,
                                                             register,
                                                             name,
                                                             id,
                                                             validationOptions,
                                                             error,
                                                             errorTextColor = "text-red-500",
                                                             errorBgColor = "bg-red-100",
                                                             errorBorderColor = "border-red-700",
                                                             required = false,
                                                             ...props
                                                         }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-2">
                {label}
            </label>
            <textarea
                {...register(id, {
                    required: required ? "This field is required" : false,
                    ...validationOptions,
                })}
                {...props}
                className={`rounded focus:border-blue-500 resize-none p-2 border text-gray-700 border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? errorBorderColor : "border-gray-300"}`}
            />
            {error && (
                <p
                    className={`${errorTextColor} text-s mt-1 border-2 ${errorBgColor} p-2`}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default TextAreaFormInput;
