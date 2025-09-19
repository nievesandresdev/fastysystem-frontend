import { useApiQuery } from '@/hooks/useApi';
import { type ClientForm } from '@/api/client.service.ts';
import { searchClientApi } from '@/api/client.service.ts';
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { updateField } from "@/stores/client/clientSlice";
import { useState, useEffect } from 'react'
//
import { InputText } from "@/components/General";

interface searchProps {
    value: string | null;
    onChange: () => void;
}
export default function SearchClient({ value, onChange}:searchProps){
    const dispatch = useAppDispatch();
    const { data, loading } = useApiQuery<ClientForm[]>(() => searchClientApi(value),[value],{ debounce: 500 });
    const [isResultsOpen, setIsResultsOpen] = useState(true);
    const clients = data?.data;

    useEffect(()=>{
        setIsResultsOpen(true)
    },[value])

    const assignData = (client):void =>{
        setIsResultsOpen(false)
        dispatch(updateField({ name:'id', value: client?.id }));
        dispatch(updateField({ name:'document', value: client?.document }));
        dispatch(updateField({ name:'name', value: client?.name }));
        dispatch(updateField({ name:'lastname', value: client?.lastname }));
        dispatch(updateField({ name:'phone', value: client?.phone }));
    }
    return (
        <div className="relative">
            <InputText 
                label="Cedula de Identidad" 
                name="document"
                type="number"
                extraClassInput="no-spinner"
                value={value}
                onChange={onChange}
                placeholder="Ej: 12123123"
            />
            <div className="bg-zinc-100 w-full top-15 left-0 absolute z-[900] shadow-xl rounded-b-[4px]">
                { isResultsOpen && clients?.length > 0 && clients.map((person)=>{
                    return(
                    <div 
                        key={person.id} className="p-1 border-b border-gray-300 flex flex-col hover:bg-gray-300 cursor-pointer"
                        onClick={() => assignData(person)}
                    >
                        <h1 className="text-base leading-5 font-semibold ml-auto bg-yellow-100 rounded px-2">{person.document}</h1>
                        <h1 className="text-base leading-5 font-semibold ml-auto">{person.name} {person.lastname}</h1>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}