import { InputText, InputAmount } from "@/components/General";
import { MeasurementUnit } from "@/api/product.service";

type StockFieldsProps = {
  formData: {
    stock: string;
    minStock: string;
    typeStockId: string;
  };
  unitsData: MeasurementUnit;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function HandleStockFields({
  formData,
  unitsData,
  onChange,
}: StockFieldsProps) {
  const { stock, minStock, typeStockId } = formData;

  const typeStockObj = unitsData.find((unit) => unit.id == typeStockId);
  if (!typeStockObj) return null;

  const isUnd = typeStockObj.abbreviation === "und";

  // Decide el componente a usar
  const FieldComponent = isUnd ? InputText : InputAmount;

  return (
    <>
      <FieldComponent
        type={isUnd ? "number" : ""}
        extraClassInput={isUnd ? "text-right" : ""}
        label="Cantidad en Stock"
        name="stock"
        value={stock}
        onChange={onChange}
        placeholder={isUnd ? "00" : "0.00"}
        {...(!isUnd && { coin: typeStockObj.abbreviation })}
      />
      <FieldComponent
        type={isUnd ? "number" : ""}
        extraClassInput={isUnd ? "text-right" : ""}
        label="Mínimo stock para alertar"
        name="minStock"
        value={minStock}
        onChange={onChange}
        placeholder={isUnd ? "00" : "0.00"}
        {...(!isUnd && { coin: typeStockObj.abbreviation })}
      />
    </>
  );
}
