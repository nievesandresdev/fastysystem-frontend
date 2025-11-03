import { XCircleIcon } from '@heroicons/react/24/solid'
import { Modal } from '../General';

type ClosureInfoModalProps = {
    isOpen: boolean;        
    onClose: () => void;
    onConfirm: () => void;
}

export default function ClosureInfoModal({ isOpen, onClose, onConfirm }: ClosureInfoModalProps) {
    return (
        <Modal 
            title="Proceso de cierre" 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[70%]"}}
        >
            <div className="bg-white p-6 rounded-lg mb-4">
                <h2 className="text-lg font-semibold mb-3">¿Qué hace este proceso?</h2>
                <p className="text-base mb-4">
                    El proceso de cierre recopilará todas las ventas que aún no han sido asignadas a ningún cierre anterior
                    y calculará las estadísticas del periodo de trabajo.
                </p>
                
                <div className="space-y-2 mb-4">
                    <p className="text-base"><strong>El proceso incluirá:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Suma total de ventas en moneda local (Bolívares)</li>
                        <li>Suma total de ventas en moneda extranjera (Dólares o Euros)</li>
                        <li>Cantidad total de productos vendidos</li>
                        <li>Desglose de métodos de pago (Débito, Efectivo, Divisas, Transferencias, Otros)</li>
                        <li>Cálculo de saldo restante por cambios devueltos</li>
                        <li>Fecha de inicio del periodo (primera venta sin cierre)</li>
                        <li>Fecha de cierre del periodo (momento actual)</li>
                    </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm">
                        <strong>⚠️ Importante:</strong> Una vez completado el cierre, las ventas seleccionadas 
                        quedarán asociadas a este cierre y no podrán ser incluidas en futuros cierres.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button 
                    onClick={onClose}
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
                </button>
                <button 
                    onClick={onConfirm}
                    className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60 font-semibold"
                >
                    EJECUTAR PROCESO
                </button>
            </div>
        </Modal>
    );
}

