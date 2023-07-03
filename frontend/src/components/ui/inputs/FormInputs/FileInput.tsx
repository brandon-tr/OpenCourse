import React, {useState} from "react";
import {FieldError, UseFormRegister} from "react-hook-form";
import Image from "next/image";

interface FileInput {
    id: string;
    register: UseFormRegister<any>;
    label?: string;
    required?: boolean;
    validationOptions?: any;
    error?: FieldError;
    errorTextColor?: string;
    errorBgColor?: string;
    errorBorderColor?: string;
    multiple?: boolean;
}

export const FileInput: React.FC<FileInput> = ({
                                                   id,
                                                   register,
                                                   label,
                                                   required = false,
                                                   validationOptions,
                                                   error,
                                                   errorTextColor = "text-red-500",
                                                   errorBgColor = "bg-red-100",
                                                   errorBorderColor = "border-red-700",
                                                   multiple = false,
                                               }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className={"py-2"}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={"file"}
                multiple={multiple}
                {...register(id, {
                    required: required ? "This field is required" : false,
                    ...validationOptions,
                })}
                accept="image/*"
                onChange={handleFileChange}
                className={`block w-full p-2 text-white border ${
                    error ? errorBorderColor : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            {preview && <Image width={200} height={200} src={preview} alt="preview"/>}
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
