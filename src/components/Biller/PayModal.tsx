import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { Modal } from "../General";
import TotalsCard from './TotalsCard';

type PayModalProps = {
    isOpen: boolean;        
    onClose: () => void;
}

export default function PayModal({ isOpen, onClose }: PayModalProps) {
    return (
        <Modal 
            title="Realizar venta" 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{bodyMaxHeight:"max-h-[76vh]", contentWidth:"w-[94%]"}}
            foot={footer()}
        >
            <div className="flex h-[76vh]">
                <div className="w-2/3 pr-6">
                    {/* button options */}
                    <div className="bg-yellow-1 border-2 border-black-1 p-2 rounded-[4px] w-full">
                        <label className="text-lg block text-black-1 font-semibold mb-1">Formas de pago</label>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                            <div className="flex gap-2 px-2 items-center bg-white border rounded-[4px]">
                                <input type="checkbox" className="" />
                                <label className="text-base text-black-1 font-semibold text-center">
                                    Debito
                                </label>
                            </div>
                            <div className="flex gap-2 px-2 items-center bg-white border rounded-[4px]">
                                <input type="checkbox" className="" />
                                <label className="text-base text-black-1 font-semibold text-center">
                                    Efectivo
                                </label>
                            </div>
                            <div className="flex gap-2 px-2 items-center bg-white border rounded-[4px]">
                                <input type="checkbox" className="" />
                                <label className="text-base text-black-1 font-semibold text-center">
                                    Divisas
                                </label>
                            </div>
                            <div className="flex gap-2 px-2 items-center bg-white border rounded-[4px]">
                                <input type="checkbox" className="" />
                                <label className="text-base text-black-1 font-semibold text-center">
                                    Transferencia bancaria
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* inputs */}
                    <div className="w-full">
                        <div className="w-1/2 mt-4">
                            <label className="text-base block text-black-1 font-semibold mb-1">Debito</label>
                            <input type="text" placeholder="Ingrese el monto" className="px-3 h-9" />
                        </div>
                        <div className="mt-4 flex gap-4 items-center w-full">
                            <div className="flex-grow">
                                <label className="text-base block text-black-1 font-semibold mb-1">Transferencia</label>
                                <input type="text" placeholder="Ingrese el monto" className="px-3 h-9" />
                            </div>
                            <div className="flex-grow">
                                <label className="text-base block text-black-1 font-semibold mb-1">Referencia</label>
                                <input type="text" placeholder="Ingrese el monto" className="px-3 h-9" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <TotalsCard />
                </div>
            </div>
            
        </Modal>
    );

}

function footer() {
    return (
        <div className="p-2 flex justify-between">
            <button className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60">
                <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
            </button>
            <button className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60">
                <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                    REALIZAR VENTA
            </button>
        </div>
    )
}