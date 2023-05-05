import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface TextInputProps {
  id: string;
  type: string;
  register: UseFormRegister<any>;
  label?: string;
  required?: boolean;
  validationOptions?: any;
  error?: FieldError;
  errorTextColor?: string;
  errorBgColor?: string;
  errorBorderColor?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  type,
  register,
  label,
  required = false,
  validationOptions,
  error,
  errorTextColor = "text-red-500",
  errorBgColor = "bg-red-100",
  errorBorderColor = "border-red-700",
}) => {
  return (
    <div className={"py-2"}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        {...register(id, {
          required: required ? "This field is required" : false,
          ...validationOptions,
        })}
        className={`block w-full p-2 text-primary border ${
          error ? errorBorderColor : "border-gray-300"
        } rounded focus:outline-none focus:border-blue-500`}
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
