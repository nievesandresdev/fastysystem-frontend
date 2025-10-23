import { type ExpenseListResponse } from '@/api/expense.service';
import { formatDateToDDMMYYYY } from '@/utils/helpers';
import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteExpenseModal from './DeleteExpenseModal';
import EditExpenseModal from './EditExpenseModal';

interface ExpenseListProps {
    expenses: ExpenseListResponse | null;
    loading: boolean;
    currExchange: { coinSymbol: string } | null;
    onReload: () => void;
}

const ExpenseList = ({ expenses, loading, currExchange, onReload }: ExpenseListProps) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    
    // Extraer el array de gastos del objeto de respuesta
    const expensesArray = expenses?.data || [];
    
    // Organizar gastos en tres grupos
    const expensesWithEffect = expensesArray.filter(e => e.status === 'with-effect') || [];
    const expensesWithoutEffect = expensesArray.filter(e => e.status === 'without-effect') || [];
    
    const temporaryExpenses = expensesWithEffect.filter(e => e.type === 'temporary');
    const fixedExpenses = expensesWithEffect.filter(e => e.type === 'fixed');

    const handleEdit = (expense: any) => {
        setSelectedExpense(expense);
        setEditModalOpen(true);
    };

    const handleDelete = (expense: any) => {
        setSelectedExpense(expense);
        setDeleteModalOpen(true);
    };

    const handleDeleteSuccess = () => {
        onReload(); // Esto recargará tanto la lista como el resumen
        setDeleteModalOpen(false);
        setSelectedExpense(null);
    };

    const handleEditSuccess = () => {
        onReload(); // Esto recargará tanto la lista como el resumen
        setEditModalOpen(false);
        setSelectedExpense(null);
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <p className="text-base">Cargando gastos...</p>
            </div>
        );
    }

    return (
        <div className="px-4 pt-3">
            {/* Bloque 1: Gastos Temporales (with-effect) */}
            <div className="mb-3">
                <div className="bg-blue-300 px-2 py-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Gastos Temporales
                    </h2>
                    <span className="bg-white text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">
                        {temporaryExpenses.length}
                    </span>
                </div>
                <div className="bg-white border-l-2 border-r-2 border-b-2 border-blue-300">
                    {temporaryExpenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-2 text-sm">Sin gastos temporales</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Concepto</th>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Descripción</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs">Período</th>
                                    <th className="text-right px-2 py-1 font-semibold text-xs">Monto</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs w-[100px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {temporaryExpenses.map((expense, idx) => (
                                    <tr key={expense.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-2 py-1.5 font-medium text-base">{expense.concept}</td>
                                        <td className="px-2 py-1.5 text-gray-600 text-xs">{expense.description}</td>
                                        <td className="px-2 py-1.5 text-center text-xs whitespace-nowrap font-bold">
                                            {formatDateToDDMMYYYY(expense.startDate)} → {formatDateToDDMMYYYY(expense.endDate)}
                                        </td>
                                        <td className="px-2 py-1.5 text-right font-bold text-red-600 whitespace-nowrap">
                                            {expense.amount} {currExchange?.coinSymbol || '$'}
                                        </td>
                                        <td className="px-2 py-1.5 text-center">
                                            <div className="flex justify-center space-x-1">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Bloque 2: Gastos Fijos (with-effect) */}
            <div className="mb-3">
                <div className="bg-blue-300 px-2 py-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Gastos Fijos
                    </h2>
                    <span className="bg-white text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">
                        {fixedExpenses.length}
                    </span>
                </div>
                <div className="bg-white border-l-2 border-r-2 border-b-2 border-blue-300">
                    {fixedExpenses.length === 0 ? (
                        <p className="text-gray-500 text-center py-2 text-sm">Sin gastos fijos</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Concepto</th>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Descripción</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs">Inicio</th>
                                    <th className="text-right px-2 py-1 font-semibold text-xs">Monto</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs w-[100px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixedExpenses.map((expense, idx) => (
                                    <tr key={expense.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-2 py-1.5 font-medium  text-base">{expense.concept}</td>
                                        <td className="px-2 py-1.5 text-gray-600 text-xs">{expense.description}</td>
                                        <td className="px-2 py-1.5 text-center text-xs font-bold">{formatDateToDDMMYYYY(expense.startDate)}</td>
                                        <td className="px-2 py-1.5 text-right font-bold text-red-600 whitespace-nowrap">
                                            {expense.amount} {currExchange?.coinSymbol || '$'}
                                        </td>
                                        <td className="px-2 py-1.5 text-center">
                                            <div className="flex justify-center space-x-1">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Bloque 3: Gastos sin efecto (without-effect) */}
            <div className="mb-3">
                <div className="bg-gray-400 px-2 py-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Gastos Sin Efecto
                    </h2>
                    <span className="bg-white text-gray-400 px-2 py-0.5 rounded-full text-xs font-bold">
                        {expensesWithoutEffect.length}
                    </span>
                </div>
                <div className="bg-white border-l-2 border-r-2 border-b-2 border-gray-400">
                    {expensesWithoutEffect.length === 0 ? (
                        <p className="text-gray-500 text-center py-2 text-sm">Sin gastos desactivados</p>
                    ) : (
                        <table className="w-full text-sm opacity-60">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Concepto</th>
                                    <th className="text-left px-2 py-1 font-semibold text-xs">Descripción</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs">Tipo</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs">Fechas</th>
                                    <th className="text-right px-2 py-1 font-semibold text-xs">Monto</th>
                                    <th className="text-center px-2 py-1 font-semibold text-xs">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expensesWithoutEffect.map((expense, idx) => (
                                    <tr key={expense.id} className={`border-t ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}>
                                        <td className="px-2 py-1.5 font-medium line-through">{expense.concept}</td>
                                        <td className="px-2 py-1.5 text-gray-600 text-xs line-through">{expense.description}</td>
                                        <td className="px-2 py-1.5 text-center">
                                            <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded">
                                                {expense.type === 'fixed' ? 'Fijo' : 'Temporal'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1.5 text-center text-xs whitespace-nowrap">
                                            {formatDateToDDMMYYYY(expense.startDate)} {expense.endDate ? `→ ${formatDateToDDMMYYYY(expense.endDate)}` : ''}
                                        </td>
                                        <td className="px-2 py-1.5 text-right font-bold text-gray-500 line-through whitespace-nowrap">
                                            {expense.amount} {currExchange?.coinSymbol || '$'}
                                        </td>
                                        <td className="px-2 py-1.5 text-center">
                                            <div className="flex justify-center space-x-1">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                    title="Restaurar gasto"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Modal de eliminación */}
            <DeleteExpenseModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                expense={selectedExpense}
                onSuccess={handleDeleteSuccess}
            />
            
            {/* Modal de edición */}
            <EditExpenseModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                expense={selectedExpense}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default ExpenseList;
