import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { Modal, Spinner } from '../General';

interface PaymentMethodBreakdown {
    debit: number;
    cash: number;
    exchange: number;
    transfer: number;
    other: number;
}

interface PaymentBreakdown {
    payments: PaymentMethodBreakdown; // Desglose de pagos recibidos (sale_payments)
    changes: PaymentMethodBreakdown; // Desglose de cambios devueltos (sale_changes)
    extraBalance: number;
}

const formatExtraBalance = (balance: number): string => {
    const numBalance = typeof balance === 'number' ? balance : parseFloat(String(balance || 0)) || 0;
    if (numBalance > 0) {
        return `Dinero extra: ${numBalance.toFixed(2)} Bs`;
    } else if (numBalance < 0) {
        return `Pérdida: ${Math.abs(numBalance).toFixed(2)} Bs`;
    } else {
        return "Equilibrado (sin ganancias ni pérdidas)";
    }
};

// Helper para convertir a número de forma segura
const safeNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value === null || value === undefined) return 0;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
};

interface ClosureResult {
    closure: {
        id: number;
        totalLocal: string;
        totalExchange: string;
        totalProductsSold: number;
        openAt: string;
        closedAt: string;
        paymentBreakdown: PaymentBreakdown;
    };
    salesCount: number;
}

type ClosureResultModalProps = {
    isOpen: boolean;        
    onClose: () => void;
    loading?: boolean;
    result?: ClosureResult;
    error?: string;
    mode?: 'create' | 'detail'; // 'create' para resultado de crear cierre, 'detail' para ver detalles
}

export default function ClosureResultModal({ isOpen, onClose, loading, result, error, mode = 'create' }: ClosureResultModalProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-VE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Determinar el título del modal según el modo
    const getModalTitle = () => {
        if (error) return "Error en el cierre";
        if (loading) return "Procesando cierre";
        if (mode === 'detail') return "Detalles del cierre";
        return "Cierre completado";
    };

    return (
        <Modal 
            title={getModalTitle()} 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[70%]"}}
        >
            {loading && (
                <div className="bg-white p-8 rounded-lg text-center">
                    <Spinner className="mx-auto mb-4" />
                    <p className="text-lg font-semibold">Espere mientras se concluye el proceso...</p>
                    <p className="text-sm text-gray-600 mt-2">Por favor no cierre esta ventana</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-white p-6 rounded-lg mb-4">
                    <div className="flex items-start gap-3 mb-4">
                        <XCircleIcon className="size-8 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 mb-2">Error al realizar el cierre</h3>
                            <p className="text-base text-gray-700">{error}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        No se han realizado cambios en el sistema. Puede intentar nuevamente.
                    </p>
                </div>
            )}

            {result && !loading && (
                <div className="bg-white p-6 rounded-lg mb-4">
                    {mode === 'create' && (
                        <div className="flex items-start gap-3 mb-6">
                            <CheckCircleIcon className="size-8 text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-green-600 mb-2">Cierre realizado con éxito</h3>
                                <p className="text-base text-gray-700">
                                    Se procesaron <strong>{result.salesCount} ventas</strong> exitosamente y se agregó un nuevo cierre a la lista.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'detail' && (
                        <div className="flex items-start gap-3 mb-6">
                            <CheckCircleIcon className="size-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">Detalles del cierre</h3>
                                <p className="text-base text-gray-700">
                                    Información completa del cierre seleccionado.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <h4 className="text-base font-semibold mb-3">Detalles del cierre:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Local (Bs.):</span>
                                <span className="font-semibold">{parseFloat(result?.closure?.totalLocal || '0').toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Exchange ($):</span>
                                <span className="font-semibold">{parseFloat(result?.closure?.totalExchange || '0').toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Productos vendidos:</span>
                                <span className="font-semibold">{result?.closure?.totalProductsSold || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fecha inicio:</span>
                                <span className="font-semibold">{formatDate(result?.closure?.openAt || '')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fecha cierre:</span>
                                <span className="font-semibold">{formatDate(result?.closure?.closedAt || '')}</span>
                            </div>
                        </div>

                        <div className="border-t mt-4 pt-4">
                            <h5 className="text-sm font-semibold mb-3">Desglose de pagos recibidos (sale_payments):</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Débito:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.payments?.debit).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Efectivo:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.payments?.cash).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Divisas:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.payments?.exchange).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transferencia:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.payments?.transfer).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Otros:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.payments?.other).toFixed(2)}</span>
                                </div>
                            </div>

                            <h5 className="text-sm font-semibold mb-3">Desglose de cambios devueltos (sale_changes):</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Débito:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.changes?.debit).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Efectivo:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.changes?.cash).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Divisas:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.changes?.exchange).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transferencia:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.changes?.transfer).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Otros:</span>
                                    <span className="font-semibold">{safeNumber(result?.closure?.paymentBreakdown?.changes?.other).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between border-t pt-2 mt-1">
                                <span className="text-gray-600 font-semibold">Balance:</span>
                                <span className="font-semibold">{formatExtraBalance(safeNumber(result?.closure?.paymentBreakdown?.extraBalance))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="flex items-center justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-blue-2 py-2.5 px-8 rounded-[4px] text-yellow-1 cursor-pointer hover-bg-black-1 font-semibold"
                    >
                        ACEPTAR
                    </button>
                </div>
            )}
        </Modal>
    );
}

