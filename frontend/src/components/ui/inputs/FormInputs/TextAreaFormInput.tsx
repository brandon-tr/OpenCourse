import React from "react";
import { UseFormRegister } from "react-hook-form";

interface TextAreaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register: UseFormRegister<any>;
  name: string;
}

const TextAreaFormInput: React.FC<TextAreaInputProps> = ({
  label,
  register,
  name,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2">
        {label}
      </label>
      <textarea
        {...register(name)}
        {...props}
        className="resize-none p-2 border rounded-md text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TextAreaFormInput;
