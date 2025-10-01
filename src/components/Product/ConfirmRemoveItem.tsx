import { ConfirmModal } from '@/components/General'
import { CTAButton, FastyButton } from "@/components/General";
import { BookmarkSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface productData {
    id: number;
    codigo: string;
    name: string;
    stock: number;
    priceRLocal: string;
    priceRExchange: string;
    qty: string;
    unitAbbreviation: string;
}

type ExchangeSettingProps = {  
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    product: productData;
};


export default function ConfirmRemoveItem({ isOpen = false, onClose, onConfirm, product}: ExchangeSettingProps) {   
    
    return (
    <ConfirmModal  
        isOpen={isOpen} 
        title={"Eliminar producto de la lista"} 
        onClose={onClose}
        contentClassName="min-w-[400px]"
    >
        <ExclamationCircleIcon className="size-10 text-red-1 mx-auto" />
        <p className="text-xl leading-7 max-w-[250px] text-center mx-auto mt-2">
            ¿Seguro que deseas retirar 
            <span className="font-semibold text-red-1"> {product?.qty}{product?.unitAbbreviation} </span>
            <span className="font-semibold"> de {product?.name} </span>
            de la lista
            ?
        </p>
        <div className="mt-6 text-center flex justify-between">
            <CTAButton 
                onClick={onClose}
                extraClassName="px-4 py-2 text-base"
            >
                Cancelar
            </CTAButton>

            <FastyButton
                type="secondary"
                extraClassName="px-4"
                onClick={onConfirm}
            >
                Aceptar
            </FastyButton>
        </div>
    </ConfirmModal>
    );
}
