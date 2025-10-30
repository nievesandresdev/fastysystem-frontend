import { ChangeEvent, FocusEvent, useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

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
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onClick?: () => void;
};

const InputText = forwardRef<HTMLInputElement, Props>(
  (
    {
      label = null,
      classInput = defaultClassInput,
      extraClassInput = "",
      classLabel = defaultClassLabel,
      name = null,
      value = "",
      placeholder = "",
      disabled = false,
      maxLength,
      error = false,
      onChange,
      type = "text",
      onFocus,
      onClick,
    }: Props,
    ref
  ) => {
    const [count, setCount] = useState(value?.length ?? 0);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      if (maxLength && val.length > maxLength) return; // no deja pasar el límite

      setCount(val.length);
      onChange(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputErrorClass =
      typeof error === "boolean" && error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : typeof error === "string"
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    // Ajustar padding derecho si hay maxLength o es password
    if (maxLength || type === "password") {
      extraClassInput += "pr-12";
    }

    return (
      <div className="w-full relative">
        {label && <label className={classLabel}>{label}</label>}

        <input
          ref={ref}
          name={name ?? ""}
          className={`${classInput} ${inputErrorClass} ${extraClassInput}`}
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          min="1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
            }
          }}
          onFocus={onFocus}
          onClick={onClick}
        />

        {/* Icono de ojo para contraseñas */}
        {type === "password" && (
          <button
            type="button"
            className="absolute top-7 right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {/* contador de caracteres si hay maxLength */}
        {maxLength && (
          <div className={`text-sm text-gray-400 font-semibold mt-1 absolute top-7 ${type === "password" ? "right-10" : "right-2"}`}>
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
);

InputText.displayName = "InputText";

export default InputText;
