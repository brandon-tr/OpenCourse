"use client";
import React from "react";
import Select, { StylesConfig } from "react-select";
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
};

const MaterialSelect: React.FC<MaterialSelectProps> = ({
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
          <Select
            id={id}
            options={options}
            value={value}
            onChange={onChange}
            isMulti={isMulti}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => String(option.id)}
            styles={customStyles}
          />
        )}
      />
    </div>
  );
};

export default MaterialSelect;
