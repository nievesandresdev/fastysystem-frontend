import { CreateForm, ExpenseHeader, ExpenseList, ExpenseSummary } from '@/components/Expense';
import { useState } from 'react';
import { useApiQuery } from '@/hooks/useApi';
import { useAppSelector } from '@/hooks/store';
import { type ExpenseListFilters, getAllExpensesApi, type ExpenseListResponse } from '@/api/expense.service';
import React from 'react';

// Función para obtener el primer día del mes actual
const getFirstDayOfMonth = (): string => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
};

// Función para obtener el último día del mes actual
const getLastDayOfMonth = (): string => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
};

const List = () => {
    
    const { current: currExchange } = useAppSelector(s => s.exchange);
    const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false);
    
    // Filtros de fecha
    const [filters, setFilters] = useState<ExpenseListFilters>({
        startDate: getFirstDayOfMonth(),
        endDate: getLastDayOfMonth()
    });

    // Query para obtener gastos - se ejecuta solo cuando se fuerza recarga
    const { data: expenses, loading } = useApiQuery<ExpenseListResponse>(
        () => getAllExpensesApi(filters),
        [(filters as any)._reload] // Solo se ejecuta cuando se fuerza recarga con el botón consultar
    );

    // Métodos
    const closeForm = () => {
        setIsCreateExpenseModalOpen(false);
    };

    const reloadList = (): void => {
        // Forzar re-render agregando un timestamp para que cambien las dependencias
        setFilters(prev => ({ 
            ...prev, 
            _reload: Date.now() // Campo temporal para forzar recarga
        }));
    };

    const openExpenseModal = (): void => {
        setIsCreateExpenseModalOpen(true);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev: ExpenseListFilters) => ({ ...prev, [name]: value }));
    };

    const handleConsult = (): void => {
        // Forzar re-render agregando un timestamp para disparar la consulta
        setFilters(prev => ({ 
            ...prev, 
            _reload: Date.now() // Campo temporal para forzar recarga
        }));
    };

    return (
        <>
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1 pb-8">
            <ExpenseHeader 
                filters={filters}
                onFilterChange={handleFilterChange}
                onCreateExpense={openExpenseModal}
                onConsult={handleConsult}
            />
                
            <div className='flex'>
                <div className='w-2/3 flex-shrink-0'>
                    <ExpenseList 
                        expenses={expenses}
                        loading={loading}
                        currExchange={currExchange}
                        onReload={reloadList}
                    />
                </div>
                <div className='w-1/3 flex-shrink-0'>
                    <ExpenseSummary 
                        filters={filters}
                        onReload={reloadList}
                    />
                </div>
            </div>
        </section>

        <CreateForm 
            isOpen={isCreateExpenseModalOpen} 
            onClose={closeForm} 
            reloadList={reloadList}
                expenseToEdit={undefined}
        />
        </>
    );
}

export default List;
