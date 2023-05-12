"use client";

import React, { FC, ChangeEvent, useState, useEffect, useMemo } from "react";
import { useUiStore } from "@/components/store/Store";
import { useDebounce } from "@/components/hooks/UseDebounce";

interface TextInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  debounced?: boolean;
}

export const TextInput: FC<TextInputProps> = ({
  label,
  value = "",
  onChange,
  debounced = false,
}) => {
  const { showNotification, hideNotification } = useUiStore();
  const [innerValue, setInnerValue] = useState(value);

  const debouncedOnChange = useDebounce(() => {
    onChange && onChange(innerValue);
    hideNotification();
  }, 500);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInnerValue(event.target.value);
    if (debounced) {
      showNotification("Results are being searched for...", "info");
      debouncedOnChange();
    } else {
      onChange && onChange(event.target.value);
    }
  };

  useEffect(() => {
    if (value !== innerValue && !debounced) {
      setInnerValue(value);
    }
  }, [value, innerValue, debounced]);

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-200">{label}</label>
      <input
        type="text"
        className="text-black p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
        value={innerValue}
        onChange={handleChange}
      />
    </div>
  );
};
