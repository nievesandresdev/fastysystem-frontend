import { CalculatorIcon } from '@heroicons/react/24/solid'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'

export default function RightPanel(){
    return (
        <>
        <div className="w-[440px] border-gray-1 border-3 bg-yellow-1 p-2 flex flex-col gap-4">
            {/* card 1 */}
            <div className="w-full rounded-[4px] bg-red-1 p-2 shadow-lg">
                <div className="flex justify-between items-center">
                    <CalendarDaysIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-6">
                        Periodo actual:
                    </h3>
                    <div>
                        <h3 className="text-xl text-yellow-1 font-semibold">15/08
                            <span className="text-sm"> a las 08:00 am</span>
                        </h3>
                        <h3 className="text-lg text-yellow-1 font-semibold">16/08 <span className="text-sm"> ahora mismo</span></h3>
                    </div>
                </div>
            </div>
            {/* card 2 */}
            <div className="w-full rounded-[4px] bg-blue-1 p-2 shadow-lg">
                <div className="flex justify-between items-end">
                    <CalculatorIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                        N° de Transacciones <br/> 
                        <span className="text-xs">en periodo:</span>
                    </h3>
                    <h1 className="text-5xl font-semibold text-yellow-1">200</h1>
                </div>
            </div>
            {/* card 3 */}
            <div className="w-full rounded-[4px] bg-orange-1 p-2 shadow-lg">
                <div className="flex justify-between items-end">
                    <CalculatorIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                        Total ventas <br/> 
                        <span className="text-xs">en periodo:</span>
                    </h3>
                    <h1 className="text-3xl font-semibold text-yellow-1">
                        20000<span className="text-xs">,00 </span>Bs
                    </h1>
                </div>
            </div>
            {/* card 4 */}
            <div className="w-full rounded-[4px] bg-blue-2 p-2 shadow-lg">
                <div className="flex justify-between items-end">
                    <CurrencyDollarIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                        Total ventas <br/> 
                        <span className="text-xs">en periodo:</span>
                    </h3>
                    <h1 className="text-3xl font-semibold text-yellow-1">
                        200<span className="text-xs">,00 </span>USD
                    </h1>
                </div>
            </div>
            <h1>TOP productos mas vendidos</h1>
            <h1>productos con poco stock</h1>
        </div>
        
        </>
    );
}