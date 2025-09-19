import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { CreateClousure } from '@/components/Closure';
import { useState } from 'react';

export default function GeneralReport(){
    const [isCreateClosureOpen, setIsCreateClosureOpen] = useState(false);
    return (
        <>
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1">
            <div className="relative pb-3 px-4 flex">
                <div>
                    <h1 className="text-xl font-semibold">Lista de cierres</h1>
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="text-sm font-semibold">Desde el:</label>
                            <input type="date" placeholder="Buscar..." className="h-9 text-base px-2" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Hasta el:</label>
                            <input type="date" placeholder="Buscar..." className="h-9 text-base px-2" />
                        </div>
                        <button className="h-9 px-4 rounded-[4px] text-yellow-1 text-center bg-blue-2 hover-bg-black-1 mt-auto cursor-pointer">
                            Buscar
                        </button>
                    </div>
                </div>
                <button className="text-xl font-semibold h-[88px] px-6 rounded-[4px] text-yellow-1 text-center bg-orange-1 hover-bg-black-1 cursor-pointer ml-auto">
                    Realizar
                </button>
            </div>
            <div className="border-t-3 border-yellow-1 px-4 pt-1">
                <div className="flex border-x pb-0.5">
                    <div className="w-[7%] text-base border-x px-1 font-bold text-center bg-white">FECHA</div>
                    <div className="w-[5%] text-base border-x px-1 font-bold text-center bg-white">HORA</div>
                    <div className="w-[8%] text-base border-x px-1 font-bold text-center bg-white">N° VENDIDOS</div>
                    <div className="flex-grow text-base border-x px-1 font-bold text-center bg-gray-100">TOTALES</div>
                    <div className="w-[7%] text-base border-x px-1 font-bold text-center bg-blue-100">N° FACTURAS</div>
                    <div className="w-[9%] text-base border-x px-1 font-bold text-center bg-orange-100">DIVISA</div>
                    <div className="w-[10%] text-base border-x px-1 font-bold text-center bg-red-200">COTIZACION</div>
                    <div className="w-[10%] text-base border-x px-1 font-bold text-center bg-red-200">ACCION</div>
                </div>
                <div className="flex border-x">
                </div>
            </div>
        </section>
        <CreateClousure isOpen={isCreateClosureOpen} onClose={() => setIsCreateClosureOpen(false)} />
        </>
    )
}