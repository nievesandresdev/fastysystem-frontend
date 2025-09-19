import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { DocumentPlusIcon } from '@heroicons/react/24/solid'
//
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { updateField } from "@/stores/client/clientSlice";
import { saveClient } from '@/stores/client/clientActions.ts';
import { toast } from "react-toastify";

//components
import { IdentifyClient } from "@/components/Biller";
import PayModal from './PayModal';
import TotalsCard from './TotalsCard';


export default function RightPanel(){
    const dispatch = useAppDispatch();
    const { data: clientForm, loading, error: clientError, original } = useAppSelector((s) => s.client);
    const [isOpen, setIsOpen] = useState(false);
    //
    //*
    //Methods
    //*
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('test name',name);
        console.log('test value',value);
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
    return (
        <>
        <div className="w-[360px] border-white border-3 bg-gray-1">
            <TotalsCard />
            <IdentifyClient 
                formData={clientForm} 
                onChange={handleChange} 
                loading={loading} 
                onSubmit={handleSubmit} 
                copyForm={original}
            />
            <div className="p-4">
                <div className="">
                    <button 
                        className="bg-blue-1 py-2 rounded-[4px] text-yellow-1 w-full flex items-center gap-2 justify-center cursor-pointer hover-bg-black-1"
                        onClick={() => setIsOpen(true)}
                    >
                        <DocumentPlusIcon className="size-7 text-yellow-1"/>
                         PAGAR DE DOS FORMAS
                    </button>
                    <button className="bg-red-1 py-2 rounded-[4px] text-yellow-1 w-full flex items-center gap-2 justify-center cursor-pointer hover-bg-black-1 mt-2">
                        <XCircleIcon className="size-7 text-yellow-1"/>
                         CANCELAR VENTA
                    </button>
                    <button className="bg-blue-2 py-2 rounded-[4px] text-yellow-1 w-full flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1">
                        <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                         REALIZAR VENTA
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