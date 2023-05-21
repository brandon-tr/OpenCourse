import { Controller, Control } from "react-hook-form";

interface MaterialSwitchProps {
  name: string;
  label?: string;
  control: Control<any>;
}

const MaterialSwitch = ({ name, label, control }: MaterialSwitchProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, name, ref } }) => (
        <label htmlFor={name} className="flex items-center cursor-pointer my-3">
          <div className="relative">
            <input
              id={name}
              type="checkbox"
              className="sr-only"
              checked={value ?? false}
              name={name}
              ref={ref}
              value={value || false} // Set an initial value of false
              onChange={(e) => onChange(e.target.checked)}
            />
            <div
              className={`block ${
                value ? "bg-accent" : "bg-gray-300"
              } w-14 h-8 rounded-full`}
            ></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform duration-200 ease-in-out ${
                value ? "translate-x-full" : ""
              }`}
            ></div>
          </div>
          {label && <div className="ml-3 font-medium">{label}</div>}
        </label>
      )}
    />
  );
};

export default MaterialSwitch;
