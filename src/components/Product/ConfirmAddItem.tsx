import { ConfirmModal } from '@/components/General'
import { InputAmount, InputText, CTAButton, MsgError } from "@/components/General";
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from '@/hooks/store';

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
    productSelected: productData | null;
    onConfirm: () => void;  
};


export default function ExchangeSetting({ isOpen = true, onClose, productSelected, onConfirm}: ExchangeSettingProps) {   
    const [quantity , setQuantity] = useState("1.00");

    const { items: itemslist } = useAppSelector((s) => s.sale);
    const itemExists = itemslist.find(item => item.id == productSelected?.id)
    const itemExistsCount = parseFloat(itemExists ? itemExists.qty : 0);
    
    useEffect(()=>{
        setQuantity(productSelected?.unitAbbreviation == "und" ? "1" : "1.00");
    },[productSelected])
    const goList = async (e): void => {
        e.preventDefault();
        if(!invalidStock){
            onConfirm(quantity);
            onClose();
        }
    };

    const invalidStock = parseFloat(quantity)+itemExistsCount > parseFloat(productSelected?.stock ?? 0);
    return (
    <ConfirmModal  
        isOpen={isOpen} 
        title={"Agregar producto"} 
        onClose={onClose}
        contentClassName="min-w-[400px]"
    >
        <h1 className="mb-4 text-xl font-bold">{productSelected?.name}</h1>
        <form onSubmit={(e) => goList(e) }>
            <InputQuantity 
                quantity={quantity}
                setQuantity={setQuantity}
                productSelected={productSelected}
                isOpen={isOpen}
            />
            {invalidStock &&
                (<div className="max-w-[366px]">
                 <MsgError message="Ha ingresado una cantidad mayor para el stock existente"/>
                </div>
                )
            }
            <div className="mt-4">
                <CTAButton 
                    extraClassName="ml-auto px-4 py-2 text-sm font-semibold mx-auto"
                    type="submit"
                    disabled={invalidStock}
                >
                    Aceptar
                </CTAButton>
            </div>
        </form>
    </ConfirmModal>
    );
}

export function InputQuantity({quantity, setQuantity, productSelected, isOpen}){
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 200);
    }, [isOpen, productSelected]);


    if(productSelected?.unitAbbreviation !== "und"){
        return (
            <InputAmount 
                key={productSelected?.id}
                label="Cantidad" 
                name="Cantidad"
                value={quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                placeholder="30.00"
                coin={productSelected?.unitAbbreviation ?? ''}
                ref={inputRef}
            />
        );
    }

    return (
        <InputText 
            key={productSelected?.id}
            label="Cantidad" 
            name="Cantidad"
            type="number"
            extraClassInput="text-right"
            value={quantity}
            onChange={(e)=> setQuantity(e.target.value)}
            placeholder="30.00"
            coin={productSelected?.unitAbbreviation ?? ''}
            ref={inputRef}
        />
    );
}