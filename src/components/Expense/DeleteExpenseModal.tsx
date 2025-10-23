import { useState } from 'react';
import { useApiMutation } from '@/hooks/useApi';
import { deleteExpenseApi } from '@/api/expense.service';
import { Modal, MsgError } from '@/components/General';
import { XCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

interface DeleteExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: any;
    onSuccess: () => void;
}

const DeleteExpenseModal = ({ isOpen, onClose, expense, onSuccess }: DeleteExpenseModalProps) => {
    const { run: deleteExpense, loading, error } = useApiMutation(deleteExpenseApi);

    const handleDelete = async () => {
        if (!expense) return;
        
        try {
            const res = await deleteExpense(expense.id);
            if (res.ok) {
                toast.success(res.message);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
        }
    };

    return (
        <Modal 
            title="Eliminar Gasto" 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[40%]"}}
        >
            <div className="mb-6">
                <p className="text-gray-700 mb-2">
                    <strong>Concepto:</strong> {expense?.concept}
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Monto:</strong> {expense?.amount} $
                </p>
                <h1 className="text-xl text-red-1 text-center font-bold">¿Estás seguro?</h1>
                <p className="text-lg text-center mt-2">
                    Este gasto dejará de hacer efecto y se eliminará para siempre y no podrás recuperarlo luego.
                </p>
            </div>

            {error && <MsgError message={error?.data?.data?.error?.message || 'Error al eliminar'} />}

            <div className="mt-4 flex items-center justify-between">
                <button 
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={onClose}
                    disabled={loading}
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
                </button>
                <button 
                    className="bg-blue-2 py-2.5 rounded-[4px] text-white flex items-center gap-2 justify-center mt-2 cursor-pointer hover:bg-red-700 w-60"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    <TrashIcon className="size-7 text-white"/>
                    {loading ? "ELIMINANDO" : "ELIMINAR"}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteExpenseModal;
