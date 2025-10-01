import { useAppSelector } from "@/hooks/store";
import { totalLocal, totalExchange } from "@/stores/sale/saleSelectors";

export default function TotalsCard() {  
    const { current: currExchange } = useAppSelector(s => s.exchange);
    const { items: itemslist } = useAppSelector((s) => s.sale);
    const totalLocalValue = useAppSelector(totalLocal);
    const totalExchangeValue = useAppSelector(totalExchange);

    return (
        <div className="border-3 rounded-[4px] p-1 shadow-xl">
            <h1 className="text-xl font-bold">TOTAL</h1>
            <div className="flex justify-between mt-1 bg-yellow-1 rounded-[4px] px-1">
                <h1 className="text-xl font-semibold">Bolivares</h1>
                <h1 className="text-2xl font-semibold">{totalLocalValue} Bs</h1>
            </div>
            <div className="flex justify-between mt-1 bg-yellow-1 rounded-[4px] px-1">
                <h1 className="text-xl font-semibold">REF</h1>
                <h1 className="text-2xl font-semibold">{totalExchangeValue} {currExchange?.coinSymbol}</h1>
            </div>
        </div>
    );

}