// PaymentMethods.tsx
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/store";
import { totalLocal, totalExchange } from "@/stores/sale/saleSelectors";
import { InputAmount, InputText } from "@/components/General";

const paymentMethods = [
  { id: "debit", label: "Débito (automático)", currency: "local" },
  { id: "cash", label: "Efectivo", currency: "local" },
  { id: "exchange", label: "Divisas", currency: "exchange" },
  { id: "transfer", label: "Transferencia bancaria", requiresRef: true, currency: "local" },
  { id: "other", label: "Otro", requiresConcept: true, currency: "exchange" },
];

export default function PaymentMethods({ payments, setPayments, autoAdjust }) {
  const { current: currExchange } = useAppSelector((s) => s.exchange);
  const exchangeVal = currExchange?.exchange ?? 0.0;
  const totalLocalValue = useAppSelector(totalLocal);
  const totalExchangeValue = useAppSelector(totalExchange);

  // Inicializar con débito
  useEffect(() => {
    setPayments((prev) => {
      if (prev.debit?.amount === totalLocalValue) return prev; // ⚡ evita loop
      return {
        debit: { amount: totalLocalValue, reference: "", concept: "" },
      };
    });
  }, [totalLocalValue, setPayments]);

  // Reajuste automático
  useEffect(() => {
    if (!autoAdjust || !Object.keys(payments).length) return;

    const totalContributed = Object.entries(payments).reduce((sum, [id, data]) => {
      const method = paymentMethods.find((m) => m.id === id);
      if (!method) return sum;
      const raw = parseFloat(data.amount) || 0;
      return sum + (method.currency === "exchange" ? raw * exchangeVal : raw);
    }, 0);

    let remaining = totalLocalValue - totalContributed;
    if (Math.abs(remaining) < 0.01) return; // ⚡ ignora ajustes mínimos

    const priority = ["debit", "cash", "transfer", "exchange", "other"];
    const mainId = priority.find((id) => payments[id]);
    if (!mainId) return;

    const mainMethod = paymentMethods.find((m) => m.id === mainId);
    if (!mainMethod) return;

    setPayments((prev) => {
      const currentAmount = parseFloat(prev[mainId]?.amount) || 0;
      const adjustedAmount =
        mainMethod.currency === "exchange"
          ? currentAmount + remaining / exchangeVal
          : currentAmount + remaining;

      // ⚡ evita loops: si ya está igual, no actualizar
      const newVal = adjustedAmount >= 0 ? adjustedAmount.toFixed(2) : "0";
      if (prev[mainId]?.amount === newVal) return prev;

      return {
        ...prev,
        [mainId]: {
          ...prev[mainId],
          amount: newVal,
        },
      };
    });
  }, [payments, totalLocalValue, exchangeVal, autoAdjust, setPayments]);

  const toggleMethod = (id) => {
    setPayments((prev) => {
      if (prev[id]) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      } else {
        return {
          ...prev,
          [id]: { amount: "0.00", reference: "", concept: "" },
        };
      }
    });
  };

  const handleChange = (id, field, value) => {
    setPayments((prev) => {
      if (prev[id]?.[field] === value) return prev; // ⚡ evita loops
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
    <div className="grid grid-cols-5 gap-2">
      {paymentMethods.map((method) => {
        const isActive = Boolean(payments[method.id]);

        return (
          <div
            key={method.id}
            className={`flex flex-col gap-2 p-2 border rounded-lg shadow-sm cursor-pointer transition 
              ${isActive ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"}`}
            onClick={() => toggleMethod(method.id)}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                readOnly
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-semibold leading-4">{method.label}</label>
            </div>

            {isActive && (
              <div className="flex flex-col gap-2 pl-2">
                <InputAmount
                  placeholder="Monto"
                  value={payments[method.id]?.amount}
                  disabled={method.id === "debit" && autoAdjust}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleChange(method.id, "amount", e.target.value)}
                  coin={method.currency === "exchange" ? currExchange.coinSymbol : "Bs"}
                />

                {method.requiresRef && (
                  <InputText
                    placeholder="Referencia"
                    value={payments[method.id]?.reference}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleChange(method.id, "reference", e.target.value)}
                  />
                )}

                {method.requiresConcept && (
                  <InputText
                    placeholder="Concepto"
                    value={payments[method.id]?.concept}
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
  );
}
