import { XCircleIcon, BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { Modal, InputText, SelectInput, InputAmount, MsgError } from "@/components/General";
import { useState, useEffect } from "react";
import { useAppSelector } from '@/hooks/store';
import { useApiMutation } from '@/hooks/useApi';
import { saveExpenseApi } from '@/api/expense.service';
import { toast } from "react-toastify";
import React from 'react';

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Función para obtener el último día del mes actual en formato YYYY-MM-DD
const getEndOfMonthDate = (): string => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
};

const initialForm = {
    concept: "",
    amount: "",
    type: "fixed",
    status: "with-effect",
    editable: true,
    startDate: getTodayDate(),
    endDate: "", // vacío por defecto porque el tipo inicial es "fixed"
    description: "",
};

type ExpenseFormData = typeof initialForm & { id?: number };

type CreateExpenseProps = {
    isOpen: boolean;        
    onClose: () => void;
    expenseToEdit?: ExpenseFormData;
    reloadList?: () => void;
}

export default function CreateForm({ isOpen, onClose, expenseToEdit, reloadList }: CreateExpenseProps) {

    const { current: currExchange } = useAppSelector(s => s.exchange);
    const [formData, setFormData] = useState<ExpenseFormData>(expenseToEdit ?? initialForm);
    const { run, loading, error } = useApiMutation(saveExpenseApi);

    const typeOptions = [
        { value: "fixed", label: "Fijo" },
        { value: "temporary", label: "Temporal" }
    ];

    // Validación: todos los campos requeridos deben estar llenos
    // endDate solo es requerido si el tipo es "temporary"
    const isFormValid = formData.concept.trim() !== "" && 
                        formData.amount.trim() !== "" && 
                        formData.type.trim() !== "" && 
                        formData.startDate.trim() !== "" &&
                        (formData.type === "fixed" || formData.endDate.trim() !== "");

    useEffect(() => {
        if (expenseToEdit) {
            setFormData(expenseToEdit);
        } else {
            setFormData(initialForm);
        }
    }, [expenseToEdit, isOpen]);

    // Manejar endDate y editable según el tipo de gasto
    useEffect(() => {
        if (formData.type === "fixed") {
            // Limpiar endDate cuando es fijo y establecer editable en true
            setFormData(prev => ({ ...prev, endDate: "", editable: true }));
        } else if (formData.type === "temporary") {
            // Si es temporal: establecer editable en false y poner fecha si no existe
            setFormData(prev => ({ 
                ...prev, 
                editable: false,
                endDate: prev.endDate || getEndOfMonthDate() 
            }));
        }
    }, [formData.type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (): Promise<void> => {
        const res = await run(formData);
        if(res.ok){
            toast.success(res.message);
            cancel();
            reloadList?.();
        }
    };

    const cancel = (): void => {
        setFormData(initialForm);
        onClose();
    };

    return (
        <Modal 
            title={expenseToEdit ? "Editar gasto" : "Crear gasto"} 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[60%]"}}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Concepto */}
                <div className="col-span-2">
                    <InputText 
                        label="Concepto del gasto" 
                        name="concept"
                        value={formData.concept}
                        onChange={handleChange}
                        placeholder="Ej: Alquiler del local"
                        maxLength={50}
                    />
                </div>

                {/* Monto */}
                <InputAmount 
                    label="Monto del gasto" 
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    coin={currExchange?.coinSymbol || "-"}
                />

                {/* Tipo */}
                <SelectInput
                    label="Tipo de gasto"
                    name="type"
                    value={formData.type}
                    options={typeOptions}
                    onChange={handleChange}
                />

                {/* Fecha de inicio */}
                <InputText 
                    label="Fecha de inicio" 
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                />

                {/* Fecha de culminación */}
                <InputText 
                    label="Fecha de culminación" 
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.type === "fixed"}
                />

                {/* Descripción */}
                <div className="col-span-2">
                    <InputText 
                        label="Descripción del gasto" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ej: Pago mensual del alquiler del local comercial"
                        maxLength={200}
                    />
                </div>
            </div>

            {error && <MsgError message={error?.data?.data?.error?.message || 'Error al guardar'} />}

            <div className="mt-4 flex items-center justify-between">
                <button 
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={cancel}
                    disabled={loading}
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
                </button>
                <button 
                    className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={submit}
                    disabled={loading || !isFormValid}
                >
                    <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                    { loading ? "ENVIANDO": "GUARDAR"}
                </button>
            </div>
        </Modal>
    );
}
