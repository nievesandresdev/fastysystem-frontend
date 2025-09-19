import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'

export default function GeneralReport(){
    return (
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1">
            <div className="relative pb-3 px-4">
                <h1 className="text-xl font-semibold">Reporte de ventas</h1>
                <div className="flex items-center gap-4">
                    <div>
                        <label className="text-sm font-semibold">Desde el:</label>
                        <input type="date" placeholder="Buscar..." className="h-9 text-base px-2" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Hasta el:</label>
                        <input type="date" placeholder="Buscar..." className="h-9 text-base px-2" />
                    </div>
                    <button className="h-9 px-4 rounded-[4px] text-yellow-1 text-center bg-black-1 hover-bg-orange-1 mt-auto cursor-pointer">
                        Generar
                    </button>
                </div>
            </div>
            <div className="border-t-3 border-yellow-1 px-4 pt-1">
                <div className="flex border-x pb-0.5">
                    <div className="w-24 text-base border-x px-1 font-bold text-center bg-white">FECHA</div>
                    <div className="w-30 text-base border-x px-1 font-bold text-center bg-white">N° PRODUCTOS VENDIDOS</div>
                    <div className="flex-grow text-base border-x px-1 font-bold text-center bg-gray-100">TOTAL EN BS</div>
                    <div className="w-60 text-base border-x px-1 font-bold text-center bg-blue-100">TOTAL EN DIVISAS</div>
                    <div className="w-38 text-base border-x px-1 font-bold text-center bg-orange-100">DIVISA</div>
                    <div className="w-30 text-base border-x px-1 font-bold text-center bg-red-200">COTIZACION</div>
                </div>
                <div className="flex border-x">
                    <div className="w-24 text-base border-x px-1 font-bold text-right bg-white">15-15-2025</div>
                    <div className="w-30 text-base border-x px-1 font-bold text-right bg-white">150</div>
                    <div className="flex-grow text-base border-x px-1 font-bold text-right bg-gray-100">2000.00</div>
                    <div className="w-60 text-base border-x px-1 font-bold text-right bg-blue-100">2000.00</div>
                    <div className="w-38 text-base border-x px-1 font-bold text-right bg-orange-100">USD</div>
                    <div className="w-30 text-base border-x px-1 font-bold text-right bg-red-200">200.00</div>
                </div>
            </div>
        </section>
    )
}