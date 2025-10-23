import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { InputText } from '@/components/General';
import { type ExpenseListFilters } from '@/api/expense.service';

interface ExpenseHeaderProps {
    filters: ExpenseListFilters;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateExpense: () => void;
    onConsult: () => void;
}

const ExpenseHeader = ({ filters, onFilterChange, onCreateExpense, onConsult }: ExpenseHeaderProps) => {
    return (
        <div className="bg-gray-1 px-4 border-b-3 border-yellow-1 pb-3 flex items-start sticky top-0 left-0 z-10">
            <div>
                <h1 className="text-xl font-semibold">Gastos</h1>
                <div className="flex items-center gap-1 mt-1">
                    <CheckCircleIcon className="size-7 text-green-500" />
                    <p className="text-base italic text-green-500 leading-5 font-semibold pr-1">Gestión de gastos fijos y temporales</p>
                </div>
            </div>

            {/* Filtros de fecha */}
            <div className="h-full border-l-3 border-yellow-1 ml-auto px-4">
                <h1 className="text-base font-semibold">Balance en intervalo de fechas:</h1>
                <div className="flex items-center gap-3">
                    <div>
                        <label className="text-sm text-gray-600">Desde:</label>
                        <InputText 
                            name="startDate"
                            type="date"
                            value={filters.startDate}
                            onChange={onFilterChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Hasta:</label>
                        <InputText 
                            name="endDate"
                            type="date"
                            value={filters.endDate}
                            onChange={onFilterChange}
                        />
                    </div>
                    <div className="flex items-end mt-auto">
                        <button 
                            className="rounded-[4px] text-white text-sm py-2 font-semibold bg-green-500 hover:bg-green-600 cursor-pointer px-4"
                            onClick={onConsult}
                        >
                            Consultar
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón crear */}
            <div className="border-l-3 border-yellow-1 ml-auto pl-4">
                <h1 className="text-base font-semibold">Opciones:</h1>
                <button 
                    className="rounded-[4px] text-yellow-1 text-base py-1 font-semibold bg-blue-1 hover-bg-black-1 cursor-pointer flex items-center justify-center gap-1 px-3 mt-1"
                    onClick={onCreateExpense}
                >
                    <PlusCircleIcon className="size-6"/>
                    Crear Gasto
                </button>
            </div>
        </div>
    );
};

export default ExpenseHeader;
