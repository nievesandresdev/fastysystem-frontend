export default function TotalsCard() {  
    return (
        <div className="border-black-1 border-2 rounded-[4px] p-2 bg-yellow-1">
            <h1 className="text-2xl font-semibold">TOTAL</h1>
            <div className="flex justify-between mt-1 bg-gray-200 rounded-[4px] px-1">
                <h1 className="text-2xl">Bolivares</h1>
                <h1 className="text-2xl">30123,00 Bs</h1>
            </div>
            <div className="flex justify-between mt-1 bg-gray-200 rounded-[4px] px-1">
                <h1 className="text-2xl">REF</h1>
                <h1 className="text-2xl">30,00</h1>
            </div>
        </div>
    );

}