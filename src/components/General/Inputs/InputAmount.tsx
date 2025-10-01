import { ChangeEvent, forwardRef } from "react";

const defaultClassInput =
  "pl-2 pr-8 mt-1 block w-full border rounded-md shadow-sm h-9 focus:outline-none text-right";
const defaultClassLabel = "block text-sm font-medium text-gray-700";

type Props = {
  label?: string;
  classInput?: string;
  extraClassInput?: string;
  classLabel?: string;
  name?: string;
  value?: string | number;              // controlado desde el padre
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;    // false | true | "mensaje de error"
  coin?: number;          
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // SOLO event
  onClick?: () => void;
};

const InputAmount = forwardRef<HTMLInputElement, Props>(
  (
    {
      label = null,
      classInput = defaultClassInput,
      extraClassInput = "",
      classLabel = defaultClassLabel,
      name = null,
      value = "",
      placeholder = "0.00",
      disabled = false,
      error = false,
      coin = "Bs",
      onChange,
      onClick
    }: Props,
    ref 
  ) => {

  // Convierte cualquier entrada a un monto con 2 decimales basado en dígitos
  // ""        -> ""  (permite vaciar y ver el placeholder)
  // "1"       -> "0.01"
  // "12"      -> "0.12"
  // "123"     -> "1.23"
  // "0012345" -> "123.45"
  const formatAmount = (raw: string): string => {
    const digits = (raw || "").replace(/\D/g, ""); // solo dígitos
    if (digits.length === 0) return "";            // dejar vacío para placeholder

    if (digits.length === 1) return `0.0${digits}`;
    if (digits.length === 2) return `0.${digits}`;

    const intPartRaw = digits.slice(0, -2);
    const decPart = digits.slice(-2);

    // normaliza enteros (quita ceros a la izquierda, pero deja "0" si toca)
    const intNum = parseInt(intPartRaw, 10);
    const intPart = Number.isNaN(intNum) ? "0" : String(intNum);

    return `${intPart}.${decPart}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);

    // Construimos un "evento compatible" solo con lo que el padre usa (name, value)
    const synthetic = {
      target: {
        name: (name ?? e.target.name) as string,
        value: formatted,
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange(synthetic);
  };

  const inputErrorClass =
    typeof error === "boolean" && error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : typeof error === "string"
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className="w-full">
      {label && <label className={classLabel}>{label}</label>}

    <div className="relative overflow-hidden">
        <input
            ref={ref}
            type="text"
            name={name ?? ""}
            className={`${classInput} ${inputErrorClass} ${extraClassInput}`}
            value={value ?? ""}           
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            inputMode="numeric"
            onClick={onClick}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
              }
            }}
        />
        <p className="absolute bg-zinc-300 top-[5.5px] right-[2px] py-[4.3px] px-1 rounded-[4px]">
            {coin}
        </p>
      </div>
      {typeof error === "string" && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
    </div>
  );
});

InputAmount.displayName = "InputAmount";
export default InputAmount;