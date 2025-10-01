// ChangeMethods.tsx
import { useAppSelector } from "@/hooks/store";
import { InputAmount, InputText } from "@/components/General";

const changeMethods = [
  { id: "cash", label: "Efectivo", currency: "local" },
  { id: "exchange", label: "Divisas", currency: "exchange" },
  { id: "transfer", label: "Transferencia bancaria", requiresRef: true, currency: "local" },
  { id: "other", label: "Otro", requiresConcept: true, currency: "exchange" }
];

export default function ChangeMethods({ change, setChange }) {
  const { current: currExchange } = useAppSelector((s) => s.exchange);

  const toggleMethod = (id) => {
    setChange((prev) => {
      const exists = Boolean(prev[id]);
      if (exists) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      // ⚠️ Ojo: no inicializamos en el render automático,
      // solo al hacer click (este punto se ejecuta SOLO si antes no existía).
      return {
        ...prev,
        [id]: prev[id] || { amount: "0.00", reference: "", concept: "" },
      };
    });
  };

  const handleChange = (id, field, value) => {
    setChange((prev) => {
      if (prev[id]?.[field] === value) return prev; // evita loops
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      };
    });
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Entrega de cambio por:</h2>
      <div className="grid grid-cols-4 gap-4">
        {changeMethods.map((method) => {
          const isActive = Boolean(change[method.id]);

          return (
            <div
              key={method.id}
              className={`flex flex-col gap-2 p-2 border rounded-lg shadow-sm cursor-pointer transition 
                ${isActive ? "bg-green-100 border-green-500" : "bg-white border-gray-300"}`}
              onClick={() => toggleMethod(method.id)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  readOnly
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="text-sm font-semibold">{method.label}</label>
              </div>

              {isActive && (
                <div className="flex flex-col gap-2 pl-6">
                  <InputAmount
                    placeholder="Monto"
                    value={change[method.id]?.amount || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleChange(method.id, "amount", e.target.value)}
                    coin={method.currency === "exchange" ? currExchange.coinSymbol : "Bs"}
                  />

                  {method.requiresRef && (
                    <InputText
                      placeholder="Referencia"
                      value={change[method.id]?.reference || ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleChange(method.id, "reference", e.target.value)}
                    />
                  )}

                  {method.requiresConcept && (
                    <InputText
                      placeholder="Concepto"
                      value={change[method.id]?.concept || ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleChange(method.id, "concept", e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
