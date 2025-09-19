import { ChangeEvent } from "react";

const defaultClassLabel = "block text-sm font-medium text-gray-700";

type Props = {
  label?: string;
  name?: string;
  value?: boolean;
  disabled?: boolean;
  error?: boolean | string; // false | true | "mensaje de error"
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ToggleInput({
  label = null,
  name = "",
  value = false,
  disabled = false,
  error = false,
  onChange,
}: Props) {
  const inputErrorClass =
    typeof error === "boolean" && error
      ? "ring-red-500 border-red-500"
      : typeof error === "string"
      ? "ring-red-500 border-red-500"
      : "ring-blue-500 border-gray-300";

  return (
    <div className="w-full">
      {label && <label className={defaultClassLabel}>{label}</label>}

      <div className="mt-2 flex items-center">
        {/* Input oculto accesible */}
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />

        {/* Switch visual */}
        <label
          htmlFor={name}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${value ? "bg-green-500" : "bg-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${inputErrorClass}
          `}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${value ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </label>

        <span className="ml-3 text-sm font-medium text-gray-700">
          {value ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* mensaje de error */}
      {typeof error === "string" && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
}
