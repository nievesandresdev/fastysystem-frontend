
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { FolderPlusIcon } from '@heroicons/react/24/solid'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { ListBulletIcon } from '@heroicons/react/24/solid'
import { useAppSelector, useAppDispatch } from "@/hooks/store";

export default function Invoice(){
    const { data: client, loading, error: clientError } = useAppSelector((s) => s.client);
    return(    
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1">
            <div className="relative pb-3 px-4">
                <label className="text-sm font-semibold">Buscar productos</label>
                <input type="text" placeholder="Buscar..." className="h-9 text-base pl-8" />
                <MagnifyingGlassIcon className="size-6 absolute bottom-5 left-6"/>
            </div>
            <div className="bg-gray-2 mt-1 overflow-auto" style={{ height:'calc(100vh - 175px)' }}>
                {client?.id}
                <ContentInvoce client={client} />
            </div>
        </section>
    )
}

export function ContentInvoce({client}){
    //Si no hay cliente
    if(!Number(client.id)){
        return (
            <div className="">
                <FolderPlusIcon className="size-20 mx-auto text-zinc-600 mt-24" />
                <p className="text-center text-4xl font-semibold text-zinc-600">Asigne un cliente <br/> a la compra</p>
                <ArrowRightIcon className="size-16 text-zinc-600 mx-auto mt-6" />
            </div>
        );
    }
    //si no hay productos
    if(true){
        return (
            <div className="">
                <ListBulletIcon className="size-20 mx-auto text-zinc-600 mt-24" />
                <p className="text-center text-4xl font-semibold text-zinc-600">Agrega un producto a la compra</p>
            </div>
        );
    }

    return (<h1>asdasd</h1>);
    
}