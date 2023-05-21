"use client";
import React from "react";
import { StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Control, Controller } from "react-hook-form";

interface Option {
  id: number;
  name: string;
  level?: number;
}

interface MaterialSelectProps {
  options: Option[];
  isMulti?: any;
  onChange?: (value: any) => void;
  label: string;
  id: string;
  control: Control<any>; // from react-hook-form
  name: string; // name of the field
}

const customStyles: StylesConfig<Option, true> = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #ced4da",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #ced4da",
    },
    borderRadius: "4px",
    padding: "4px",
  }),
  option: (provided) => ({
    ...provided,
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e2e2e2",
    borderRadius: "4px",
    color: "red",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "black",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "black",
    ":hover": {
      backgroundColor: "",
      color: "black",
    },
  }),
  menu: (provided) => ({
    ...provided,
    animation: "fadeIn 0.5s", // Add a fade-in animation to the menu
  }),
  // Add styles for the create option popup
  input: (provided) => ({
    ...provided,
    color: "black",
    "&::placeholder": {
      color: "#a0aec0",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "white",
  }),
};

const MaterialCombo: React.FC<MaterialSelectProps> = ({
  options,
  isMulti = false,
  label,
  id,
  control,
  name,
  ...props
}) => {
  return (
    <div className={"py-2"}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref } }) => (
          <CreatableSelect
            id={id}
            value={value}
            options={options}
            onChange={onChange}
            isMulti={isMulti}
            name={name}
            styles={customStyles} // Apply the custom styles to the CreatableSelect component
          />
        )}
      />
    </div>
  );
};

export default MaterialCombo;
