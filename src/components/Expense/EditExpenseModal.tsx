import { useState } from 'react';
import React from 'react';
import { Modal, InputText, InputAmount, MsgError } from '@/components/General';
import { XCircleIcon, BookmarkSquareIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useAppSelector } from '@/hooks/store';
import { useApiMutation } from '@/hooks/useApi';
import { toggleExpenseStatusApi, updateExpenseApi, completeExpenseApi } from '@/api/expense.service';
import { toast } from 'react-toastify';

interface EditExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: any;
    onSuccess: () => void;
}

const EditExpenseModal = ({ isOpen, onClose, expense, onSuccess }: EditExpenseModalProps) => {
    const { current: currExchange } = useAppSelector(s => s.exchange);
    const [activeModule, setActiveModule] = useState<'edit' | 'complete' | 'disable' | null>(null);
    const { run: toggleStatus, loading: toggleLoading, error: toggleError } = useApiMutation(toggleExpenseStatusApi);
    const { run: updateExpense, loading: updateLoading, error: updateError } = useApiMutation(updateExpenseApi);
    const { run: completeExpense, loading: completeLoading, error: completeError } = useApiMutation(completeExpenseApi);
    
    // Estado para el módulo de edición
    const [editForm, setEditForm] = useState({
        concept: '',
        amount: '',
        type: 'fixed',
        startDate: '',
        endDate: '',
        description: ''
    });

    // Estado para el módulo de culminación
    const [completionDate, setCompletionDate] = useState('');

    // Rellenar datos cuando cambie el expense
    React.useEffect(() => {
        if (expense) {
            setEditForm({
                concept: expense.concept || '',
                amount: expense.amount || '',
                type: expense.type || 'fixed',
                startDate: expense.startDate || '',
                endDate: expense.endDate || '',
                description: expense.description || ''
            });
        }
    }, [expense]);


    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCompletionDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompletionDate(e.target.value);
    };

    const handleEditSubmit = async () => {
        if (!expense) return;
        
        try {
            const res = await updateExpense(expense.id, editForm);
            if (res.ok) {
                toast.success(res.message);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error al actualizar gasto:', error);
        }
    };

    const handleCompletionSubmit = async () => {
        if (!expense || !completionDate) return;
        
        try {
            const res = await completeExpense(expense.id, completionDate);
            if (res.ok) {
                toast.success(res.message);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error al culminar gasto:', error);
        }
    };

    const handleToggleEffect = async () => {
        if (!expense) return;
        
        try {
            const res = await toggleStatus(expense.id);
            if (res.ok) {
                toast.success(res.message);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error al cambiar estado del gasto:', error);
        }
    };

    const isEditFormValid = editForm.concept.trim() !== "" && 
                           editForm.amount.trim() !== "" && 
                           editForm.type.trim() !== "" && 
                           editForm.startDate.trim() !== "" &&
                           (editForm.type === "fixed" || editForm.endDate.trim() !== "");

    const isCompletionFormValid = completionDate.trim() !== "";

    return (
        <Modal 
            title="Gestionar Gasto" 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[60%]"}}
        >
            <div className="space-y-4">
                {/* Acordeón de módulos */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Módulo 1: Editar Gasto */}
                    <div className="border-b border-gray-300">
                        <button
                            onClick={() => setActiveModule(activeModule === 'edit' ? null : 'edit')}
                            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between ${
                                activeModule === 'edit' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <BookmarkSquareIcon className="w-5 h-5" />
                                Editar Gasto
                            </span>
                            <span className={`transform transition-transform ${activeModule === 'edit' ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                        
                        {activeModule === 'edit' && (
                            <div className="p-4 bg-white">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Concepto */}
                                    <InputText 
                                        label="Concepto del gasto" 
                                        name="concept"
                                        value={editForm.concept}
                                        onChange={handleEditChange}
                                        placeholder="Ej: Alquiler del local"
                                        maxLength={50}
                                    />

                                    {/* Monto */}
                                    <InputAmount 
                                        label="Monto del gasto" 
                                        name="amount"
                                        value={editForm.amount}
                                        onChange={handleEditChange}
                                        placeholder="0.00"
                                        coin={currExchange?.coinSymbol || "-"}
                                    />


                                    {/* Fecha de inicio */}
                                    <InputText 
                                        label="Fecha de inicio" 
                                        name="startDate"
                                        type="date"
                                        value={editForm.startDate}
                                        onChange={handleEditChange}
                                    />

                                    {/* Fecha de culminación */}
                                    <InputText 
                                        label="Fecha de culminación" 
                                        name="endDate"
                                        type="date"
                                        value={editForm.endDate}
                                        onChange={handleEditChange}
                                        disabled={editForm.type === "fixed"}
                                    />

                                    {/* Descripción */}
                                    <div className="col-span-2">
                                        <InputText 
                                            label="Descripción del gasto" 
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            placeholder="Ej: Pago mensual del alquiler del local comercial"
                                            maxLength={200}
                                        />
                                    </div>
                                </div>

                                {updateError && <MsgError message={String(updateError?.data?.data?.error?.message || 'Error al actualizar gasto')} />}

                                <div className="mt-4 flex justify-end">
                                    <button 
                                        className="bg-blue-2 py-2.5 rounded-[4px] text-white flex items-center gap-2 justify-center px-6 cursor-pointer hover:bg-blue-700"
                                        onClick={handleEditSubmit}
                                        disabled={!isEditFormValid || updateLoading}
                                    >
                                        <BookmarkSquareIcon className="size-5 text-white"/>
                                        {updateLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Módulo 2: Marcar como Culminado - Solo para gastos fijos */}
                    {expense?.type === 'fixed' && (
                        <div>
                            <button
                                onClick={() => setActiveModule(activeModule === 'complete' ? null : 'complete')}
                                className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between ${
                                    activeModule === 'complete' 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Marcar Gasto como Culminado
                                </span>
                                <span className={`transform transition-transform ${activeModule === 'complete' ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            
                            {activeModule === 'complete' && (
                            <div className="p-4 bg-white">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-700 mb-2">
                                            <strong>Gasto:</strong> {expense?.concept}
                                        </p>
                                        <p className="text-gray-700 mb-4">
                                            <strong>Monto:</strong> {expense?.amount} {currExchange?.coinSymbol || '$'}
                                        </p>
                                    </div>

                                    <InputText 
                                        label="Fecha de finalización del gasto" 
                                        name="completionDate"
                                        type="date"
                                        value={completionDate}
                                        onChange={handleCompletionDateChange}
                                    />

                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Nota:</strong> Al marcar este gasto como culminado, dejará de ser un gasto fijo y se moverá a la sección de "Gastos Temporales".
                                        </p>
                                        <p className="text-center mt-4 text-base font-medium">
                                            Este gasto se tomo en cuenta para el cálculo de ganancias en el periodo:
                                            <br />Desde: {expense?.startDate} 
                                            <br />Hasta: {completionDate || <span className="text-red-500">XX/XX/XXXX(agregue una fecha de culminación)</span>}.
                                        </p>
                                    </div>
                                </div>

                                {completeError && <MsgError message={String(completeError?.data?.data?.error?.message || 'Error al culminar gasto')} />}

                                <div className="mt-4 flex justify-end">
                                    <button 
                                        className="bg-green-600 py-2.5 rounded-[4px] text-white flex items-center gap-2 justify-center px-6 cursor-pointer hover:bg-green-700"
                                        onClick={handleCompletionSubmit}
                                        disabled={!isCompletionFormValid || completeLoading}
                                    >
                                        <CheckCircleIcon className="size-5 text-white"/>
                                        {completeLoading ? 'CULMINANDO...' : 'CONFIRMAR CULMINACIÓN'}
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    )}

                    {/* Módulo 3: Dejar sin efecto - Para ambos tipos */}
                    <div>
                        <button
                            onClick={() => setActiveModule(activeModule === 'disable' ? null : 'disable')}
                            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between ${
                                activeModule === 'disable' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                {expense?.status === 'with-effect' ? 'Dejar sin Efecto' : 'Activar Efecto'}
                            </span>
                            <span className={`transform transition-transform ${activeModule === 'disable' ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                        
                        {activeModule === 'disable' && (
                            <div className="p-4 bg-white">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-700 mb-2">
                                            <strong>Gasto:</strong> {expense?.concept}
                                        </p>
                                        <p className="text-gray-700 mb-2">
                                            <strong>Monto:</strong> {expense?.amount} {currExchange?.coinSymbol || '$'}
                                        </p>
                                        <p className="text-gray-700 mb-4">
                                            <strong>Tipo:</strong> {expense?.type === 'fixed' ? 'Fijo' : 'Temporal'}
                                        </p>
                                    </div>

                                    {expense?.status === 'with-effect' ? (
                                        <div className="bg-orange-50 border border-orange-200 rounded p-3">
                                            <p className="text-orange-800 text-sm">
                                                <strong>Dejar sin efecto:</strong> Este gasto seguirá mostrándose en la lista pero no tendrá ningún efecto en los cálculos de ganancias. Podrás reactivarlo más tarde si es necesario.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded p-3">
                                            <p className="text-green-800 text-sm">
                                                <strong>Activar efecto:</strong> Este gasto volverá a tener efecto en los cálculos de ganancias y se incluirá en el resumen financiero.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {toggleError && <MsgError message={String(toggleError?.data?.data?.error?.message || 'Error al cambiar estado')} />}

                                <div className="mt-4 flex justify-end">
                                    <button 
                                        className={`py-2.5 rounded-[4px] text-white flex items-center gap-2 justify-center px-6 cursor-pointer ${
                                            expense?.status === 'with-effect' 
                                                ? 'bg-orange-600 hover:bg-orange-700' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                        onClick={handleToggleEffect}
                                        disabled={toggleLoading}
                                    >
                                        <ExclamationTriangleIcon className="size-5 text-white"/>
                                        {toggleLoading 
                                            ? 'PROCESANDO...' 
                                            : expense?.status === 'with-effect' 
                                                ? 'DEJAR SIN EFECTO' 
                                                : 'ACTIVAR EFECTO'
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button 
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={onClose}
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
                </button>
            </div>
        </Modal>
    );
};

export default EditExpenseModal;
