import { ChangeEvent, forwardRef } from "react";

const defaultClassLabel = "block text-sm font-medium text-gray-700";
const defaultClassCheckbox = "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded";

type Props = {
  label?: string;
  classCheckbox?: string;
  classLabel?: string;
  name?: string;
  value?: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputCheckbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      label = null,
      classCheckbox = defaultClassCheckbox,
      classLabel = defaultClassLabel,
      name = "",
      value = false,
      disabled = false,
      onChange,
    }: Props,
    ref
  ) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          name={name}
          type="checkbox"
          className={classCheckbox}
          checked={value}
          onChange={onChange}
          disabled={disabled}
        />
        {label && (
          <label className={`ml-2 ${classLabel}`}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

InputCheckbox.displayName = "InputCheckbox";

export default InputCheckbox;
