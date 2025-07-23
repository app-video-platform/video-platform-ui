import React from 'react';

interface GalCheckboxInputProps {
  label: string;
  name: string;
  checked: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const GalCheckboxInput: React.FC<GalCheckboxInputProps> = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
    />
    <label
      htmlFor={name}
      className="ml-2 block text-sm leading-5 text-gray-900"
    >
      {label}
    </label>
  </div>
);

export default GalCheckboxInput;
