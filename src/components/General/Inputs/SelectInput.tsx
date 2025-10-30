import type { ChangeEvent } from "react";

const defaultClassSelect =
  "px-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm h-9";
const defaultClassLabel = "block text-sm font-medium text-gray-700";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  classSelect?: string;
  classLabel?: string;
  name?: string;
  value?: string;
  options: Option[];
  placeholder?: string; // para mostrar como opción inicial deshabilitada
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectInput({
  label = null,
  classSelect = defaultClassSelect,
  classLabel = defaultClassLabel,
  name = "",
  value = "",
  options,
  placeholder = "",
  onChange,
}: Props) {
  return (
    <div>
      {label && <label className={classLabel}>{label}</label>}
      <select
        name={name}
        className={classSelect}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option key="placeholder" value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
