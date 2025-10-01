import { DocumentPlusIcon } from '@heroicons/react/24/solid'
import { InputText } from "@/components/General";
import { SearchClient } from "@/components/Client";
import { isEqual } from "@/utils/helpers";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { deleteId } from "@/stores/client/clientSlice";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};
const now = new Date();

export default function IdentifyClient({ onChange, onSubmit }: Props) {
    const dispatch = useAppDispatch();
    const { data: clientForm, loading, error: clientError, original } = useAppSelector((s) => s.client);
    const hasChanges = !isEqual(clientForm, original);
    const validate = clientForm.name && clientForm.document && hasChanges;
    
    const deleteClientId = (client):void =>{
        dispatch(deleteId());
    }
    return (
        <form 
            className="px-4 py-2 bg-gray-1 border-white border-y-3 flex flex-col gap-1"
            onSubmit={(e) => {e.preventDefault(); onSubmit();}}
        >
            {/* date time */}
            {/* <div className="flex items-center gap-2 pb-3 border-b-3 border-yellow-1">
                <InputText 
                    label="Fecha" 
                    name="date"
                    type="date"
                    value={now.toISOString().split("T")[0]}
                    placeholder="Ej: 12123123"
                />
                <InputText 
                    label="Hora" 
                    name="time"
                    type="time"
                    value={now.toTimeString().slice(0, 5)}
                    placeholder="Ej: 12123123"
                />
            </div> */}
            <div className="flex items-end gap-2">
                <h1 className="text-xl bg-yellow-1 py-1 px-2 rounded-md font-semibold">Datos del cliente</h1>
                <div className="bg-yellow-1 rounded-md p-1 flex-grow">
                    <div className="flex items-center justify-between">
                        <p className="text-lg leading-6 font-semibold">Fecha: </p>
                        <p className="text-lg leading-6">{new Date(now.toISOString().split("T")[0]).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg leading-6 font-semibold">Hora: </p>
                        <p className="text-lg leading-6">{now.toTimeString().slice(0, 5)}</p>
                    </div>
                </div>
            </div>
            {/* document */}
            <SearchClient 
                value={clientForm.document}
                onChange={onChange}
            />
            {/* name */}
            <div>
                <InputText 
                    label="Nombre" 
                    name="name"
                    value={clientForm.name ?? ""}
                    onChange={onChange}
                    placeholder="Ej: Pedro..."
                    extraClassInput={`${clientForm.id ? 'bg-gray-1':''}`}
                    onFocus={()=> deleteClientId()}
                />
            </div>
            {/* phone, lastname, submit */}
            <div className="flex gap-3">
                <div className="flex-grow">
                    {/* lastname */}
                    <div>
                        <InputText 
                            label="Apellido" 
                            name="lastname"
                            value={clientForm.lastname ?? ""}
                            onChange={onChange}
                            extraClassInput={`${clientForm.id ? 'bg-gray-1':''}`}
                            placeholder="Ej: Perez..."
                            onFocus={()=> deleteClientId()}
                        />
                    </div>
                    {/* phone */}
                    <div>
                        <InputText 
                            label="Telefono" 
                            name="phone"
                            type="number"
                            extraClassInput={`${clientForm.id ? 'bg-gray-1':''} no-spinner`}
                            value={clientForm.phone ?? ""}
                            onChange={onChange}
                            placeholder="Ej: 0412-0552233"
                            onFocus={()=> deleteClientId()}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-1 hover-bg-black-1 p-1 mt-6 rounded-md shadow text-yellow-1 w-20 cursor-pointer disabled:opacity-50"
                    disabled={loading || !validate || clientForm.id}
                >
                    <DocumentPlusIcon className="size-8 mx-auto" />
                    <p className="text-base font-semibold pt-1">Asignar</p>
                </button>
            </div>
        </form>
    );
}