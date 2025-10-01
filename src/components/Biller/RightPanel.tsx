import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { DocumentPlusIcon } from '@heroicons/react/24/solid'
//
import { useState } from 'react'
import useHotkey from "@/hooks/useHotkey.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { updateField, resetClientForm } from "@/stores/client/clientSlice";
import { clearSale } from "@/stores/sale/saleSlice";
import { saveClient } from '@/stores/client/clientActions.ts';
import { toast } from "react-toastify";

//components
import { IdentifyClient } from "@/components/Biller";
import PayModal from './PayModal';
import TotalsCard from './TotalsCard';


export default function RightPanel(){
    const dispatch = useAppDispatch();
    useHotkey("F4", () => itemslist.length ? setIsOpen(true) : "");
    useHotkey("F8", () => itemslist.length || clientForm?.id ? cancelSale() : "");

    const { data: clientForm, error: clientError, original } = useAppSelector((s) => s.client);
    const { items: itemslist} = useAppSelector((s) => s.sale);
    const [isOpen, setIsOpen] = useState(false);
    //
    //*
    //Methods
    //*
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updateField({ name, value }));
    };

    const handleSubmit = async () => {
        const { meta, payload } = await dispatch(saveClient(clientForm));
        if (meta.requestStatus === "fulfilled") {
            toast.success("Cliente actualizado!");
        }
        if(clientError){
            toast.error(clientError);
        }
    };

    const cancelSale = () => {
        dispatch(clearSale());
        dispatch(resetClientForm());
        toast.success("Venta cancelada!");
    };
    return (
        <>
        <div className="w-[360px] border-white border-3 bg-gray-1">
            <TotalsCard />
            <IdentifyClient 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
            />
            <div className="p-4">
                <div className="">
                    <button 
                        className="bg-blue-1 py-2 rounded-[4px] text-yellow-1 w-full flex items-center gap-2 justify-center cursor-pointer hover-bg-black-1"
                        onClick={() => setIsOpen(true)}
                        disabled={!itemslist.length}
                    >
                        <DocumentPlusIcon className="size-7 text-yellow-1"/>
                         PAGAR <span className="font-bold">( F4 )</span>
                    </button>
                    <button 
                        className="bg-red-1 py-2 rounded-[4px] text-yellow-1 w-full flex items-center gap-2 justify-center cursor-pointer hover-bg-black-1 mt-2"
                        disabled={!itemslist.length && !clientForm.id}
                        onClick={()=> cancelSale()}
                    >
                        <XCircleIcon className="size-7 text-yellow-1"/>
                         CANCELAR VENTA <span className="font-bold">( F8 )</span>
                    </button>
                    
                </div>
            </div>
        </div>
        <PayModal 
            isOpen={isOpen} 
            onClose={()=> setIsOpen(false)} 
        />
        </>
    );
}