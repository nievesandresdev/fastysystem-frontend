import { ChangeEvent, useState } from "react";

const defaultClassInput =
  "px-2 mt-1 block w-full border rounded-md shadow-sm h-9 focus:outline-none";
const defaultClassLabel = "block text-sm font-medium text-gray-700";

type Props = {
  label?: string;
  classInput?: string;
  extraClassInput?: string;
  classLabel?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  error?: boolean | string; // false | true | "mensaje de error"
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

export default function InputText({
  label = null,
  classInput = defaultClassInput,
  extraClassInput = '',
  classLabel = defaultClassLabel,
  name = null,
  value = "",
  placeholder = "",
  disabled = false,
  maxLength,
  error = false,
  onChange,
  type = "text"
}: Props) {
  const [count, setCount] = useState(value?.length ?? 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (maxLength && val.length > maxLength) return; // no deja pasar el límite

    setCount(val.length);
    onChange(e);
  };

  const inputErrorClass =
    typeof error === "boolean" && error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : typeof error === "string"
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  if(maxLength){
    extraClassInput += "pr-12";
  }
  return (
    <div className="w-full relative">
      {label && <label className={classLabel}>{label}</label>}

      <input
        name={name ?? ""}
        className={`${classInput} ${inputErrorClass} ${extraClassInput}`}
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        type={type}
      />

      {/* contador de caracteres si hay maxLength */}
      {maxLength && (
        <div className="text-sm text-gray-400 font-semibold mt-1 absolute top-7 right-2">
          {count}/{maxLength}
        </div>
      )}

      {/* mensaje de error */}
      {typeof error === "string" && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}
