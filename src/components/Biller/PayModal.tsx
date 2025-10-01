// PayModal.tsx
import { useState } from "react";
import { useAppSelector } from "@/hooks/store";
import { totalLocal } from "@/stores/sale/saleSelectors";
import { Modal, ToggleInput } from "@/components/General";
import TotalsCard from "./TotalsCard";
import Footer from "./PayModalFooter";
import PaymentMethods from "./PayModalPaymentMethods";
import ChangeMethods from "./PayModalChangeMethods";
import { calculatePrice } from "@/utils/helpers";

const paymentNames = {
  debit: "Débito",
  cash: "Efectivo",
  exchange: "Divisas",
  transfer: "Transferencia bancaria",
  other: "Otro",
};

export default function PayModal({ isOpen, onClose }) {
  const { current: currExchange } = useAppSelector((s) => s.exchange);
  const totalLocalValue = useAppSelector(totalLocal);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [payments, setPayments] = useState({});
  const [change, setChange] = useState({}); 
  // calcular subtotal
  const totalPaid = Object.keys(payments).reduce((acc, pay) => {
    const raw = parseFloat(payments[pay]?.amount || "0");
    const isExchange = pay === "exchange" || pay === "other";
    return acc + (isExchange ? raw * (parseFloat(currExchange?.exchange) || 0) : raw);
  }, 0);

  //clientChange
  const customerChange = totalPaid - parseFloat(totalLocalValue || "0");
  const missing = Number(customerChange)*(-1);
  const pendingClientChange = parseFloat(totalPaid) > parseFloat(totalLocalValue);
  const paidChange = Object.keys(change).reduce((acc, key) => {
  const raw = parseFloat(change[key]?.amount || "0");
  const isExchange = key === "exchange" || key === "other";
    return acc + (isExchange ? raw * (parseFloat(currExchange?.exchange) || 0) : raw);
  }, 0);

  const remainingChange = customerChange - paidChange;
  //
  const countClientChange = Object.keys(change).length;
  const hasChangeWithAmount = Object.values(change).some(
    (method) => parseFloat(method.amount) > 0
  );
  const clientChangeNotSpec = pendingClientChange && (countClientChange == 0 || !hasChangeWithAmount);
  const validSale = totalPaid >= parseFloat(totalLocalValue || "0") && !clientChangeNotSpec;
  
  return (
    <Modal
      title="Realizar venta"
      isOpen={isOpen}
      onClose={onClose}
      styles={{ bodyMaxHeight: "max-h-[74vh]", contentWidth: "w-[94%]" }}
      foot={
        <Footer validSale={validSale}
          payments={payments}
          change={change}
          onClose={onClose} 
        />
        }
        >
      <div className="flex" style={{ minHeight: "calc(100vh - 210px)" }}>
        {/* Izquierda: formas de pago */}
        <div className="w-3/4 max-h-[68vh] overflow-auto">
          <div className="bg-yellow-1 border-2 border-black-1 p-2 rounded-[4px] w-full">
            <div className="flex items-center justify-between w-full mb-4">
              <label className="text-xl text-black-1 font-semibold">Formas de pago</label>
              <div>
                <ToggleInput
                  label="Cálculo automático"
                  name="autoAdjust"
                  value={autoAdjust}
                  onChange={(e) => setAutoAdjust(e.target.checked)}
                />
              </div>
            </div>
            <PaymentMethods
              payments={payments}
              setPayments={setPayments}
              autoAdjust={autoAdjust}
            />
            {customerChange > 0 && (
              <ChangeMethods change={change} setChange={setChange} />
            )}
          </div>
        </div>

        {/* Derecha: Totales */}
        <div className="w-1/4 pl-4 flex flex-col justify-between">
          <TotalsCard />
          <h1 className="text-xl font-bold text-red-1 mt-auto mb-2">Detalles de pago:</h1>
          <div className="bg-white border rounded p-3">
            {Object.keys(payments).map((item) => (
              <div key={item} className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-500">
                  {paymentNames[item]}: {payments[item].amount || "0"}{" "}
                  {item === "exchange" || item === "other" ? currExchange?.coinSymbol : "Bs"}
                </p>
              </div>
            ))}

            <p className="text-lg font-bold text-black-1">
              Total pagado: {totalPaid.toFixed(2)} Bs
            </p>
            <p className="text-lg font-bold text-black-1">
              Total venta: {totalLocalValue} Bs
            </p>
            {parseFloat(totalPaid) < parseFloat(totalLocalValue) && (<p className="text-lg font-bold text-red-500">
              Faltan: {missing.toFixed(2)} Bs ó {calculatePrice(missing, currExchange?.exchange, "", currExchange?.coinSymbol)}
            </p>)}

            {/* change */}
            {parseFloat(totalPaid) > parseFloat(totalLocalValue) && (<p className="text-lg font-bold mt-4 text-gray-500">
              Cambio: {customerChange.toFixed(2)} Bs ó {calculatePrice(customerChange, currExchange?.exchange, "", currExchange?.coinSymbol)}
            </p>)}
            {parseFloat(totalPaid) > parseFloat(totalLocalValue) && (<p className="text-lg font-bold ">
              C.Pagado: {paidChange.toFixed(2)} Bs <span className={`text-${parseFloat(remainingChange) > 0? 'green' : 'red'}-500`}>- ({remainingChange.toFixed(2)} Bs)</span>
            </p>)}
            
          </div>
        </div>
      </div>
    </Modal>
  );
}
