
import { MagnifyingGlassIcon, FolderPlusIcon, ArrowRightIcon, TrashIcon, ListBulletIcon } from '@heroicons/react/24/solid'
//
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { addItem, removeItem } from "@/stores/sale/saleSlice";
//
import { SearchProduct, ConfirmAddItem, ConfirmRemoveItem } from "@/components/Product";
import { FlexTable } from '@/components/General';
import { toast } from "react-toastify";


export default function Invoice(){
    const dispatch = useAppDispatch();

    const { data: client, loading, error: clientError } = useAppSelector((s) => s.client);
    const { items: itemslist, loading: loadingList, error: listError } = useAppSelector((s) => s.sale);
    const [isConfirmAddItemOpen, setIsConfirmAddItemOpen] = useState(false)
    const [productSelected, setProductSelected] = useState(null)
    
    const totalItemsList = itemslist.reduce((acc, item) => {
        const qty = item.unitAbbreviation !== "und" ? 1.00 : item.qty;
        return acc + Number(qty);
    },0);

    const onProductSelect = (product) =>{   
        setIsConfirmAddItemOpen(true)
        setProductSelected(product)
    }

    const onConfirmProduct = (quantity) =>{
        
        setIsConfirmAddItemOpen(false);
        dispatch(addItem({ 
            id: productSelected.id, 
            codigo: productSelected.codigo, 
            name: productSelected.name, 
            stock: productSelected.stock, 
            priceRLocal: productSelected.priceRLocal, 
            priceRExchange: productSelected.priceRExchange, 
            qty: parseFloat(quantity),
            unitAbbreviation: productSelected.unitAbbreviation 
        }));
    }
    
   

    return(    
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1">
            <div className="flex w-full gap-2 px-4">
                {/* buscador */}
                <div className="relative pb-3 w-3/4">
                    <SearchProduct disabled={!Number(client.id)} onProductSelect={onProductSelect}/>
                    <MagnifyingGlassIcon className="size-6 absolute bottom-5 left-2"/>
                </div>
                <div className="ml-auto bg-green-100 px-1.5 rounded-md shadow">
                    <h1 className="text-sm font-semibold leading-[18px] text-right">N° de <br/> Productos</h1>
                    <h1 className="text-2xl font-bold text-right">{totalItemsList}</h1>
                </div>
            </div>
            <div className="bg-gray-2 mt-1 overflow-auto" style={{ height:'calc(100vh - 183px)' }}>
                <ContentInvoce client={client} itemslist={itemslist} loadingList={loadingList}/>
            </div>
            <ConfirmAddItem 
                isOpen={isConfirmAddItemOpen} 
                onClose={()=> setIsConfirmAddItemOpen(false)}
                productSelected={productSelected}
                onConfirm={onConfirmProduct}
            />
        </section>
    )
}

export function ContentInvoce({client, itemslist, loadingList}){
    const dispatch = useAppDispatch();
    const { current: currExchange} = useAppSelector(s => s.exchange);
    const [productToDel, setProductToDel] = useState(null)
    const [isConfirmDeleteItem, setIsConfirmDeleteItem] = useState(false)
    
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
    if(!itemslist.length){
        return (
            <div className="">
                <ListBulletIcon className="size-20 mx-auto text-zinc-600 mt-24" />
                <p className="text-center text-4xl font-semibold text-zinc-600">Agrega un producto a la compra</p>
            </div>
        );
    }

    const confirmRemoveItem = () =>{
        setIsConfirmDeleteItem(false)
        dispatch(removeItem(productToDel.id))
        setProductToDel(null)
        toast.success("Producto eliminado");
    }

    const removeItemInList = (p) =>{
        setIsConfirmDeleteItem(true)
        setProductToDel(p)
    }

    return (
        <div>
            <FlexTable
                columns={[
                    { 
                        key: "name", label: "PRODUCTO", className: "flex-grow bg-gray-100",
                        render: (p) => (<p className="text-base content-center h-full leading-4 font-bold text-left">{p.name}</p>)
                    },
                    { 
                        key: "qty", label: "CANTIDAD", className: "w-[8%] bg-gray-100",
                        render: (p) => (<p className="text-base content-center h-full leading-4 font-bold">{p.qty}</p>)
                    },
                    { 
                        key: "priceRLocal", label: "COSTO UNIDAD", className: "w-[16%] bg-gray-100",
                        render: (p) => (<p className="text-base content-center text-right pr-1 h-full leading-4 font-bold">{p.priceRLocal} Bs</p>)
                    },
                    { 
                        key: "total", label: 'SUB-TOTAL', className: "w-[16%] bg-blue-100",
                        render: (p) => (<p className="text-base content-center text-right pr-1 h-full leading-4 font-bold">{(parseFloat(p.priceRLocal).toFixed(2)*p.qty).toFixed(2)} Bs</p>)
                    },
                    { 
                        key: "-", label: '-', className: "w-[3.5%] bg-gray-100",
                        render: (p) => (
                            <TrashIcon onClick={() => removeItemInList(p)} className="size-6 cursor-pointer"/>
                        )
                    },
                ]}
                data={itemslist ?? []}
                isLoading={loadingList}
                currentPage={1}
                numRows={itemslist.length}
                hoverSelect={false}
            />
            <ConfirmRemoveItem 
                isOpen={isConfirmDeleteItem}
                onClose={() => setIsConfirmDeleteItem(false)}
                onConfirm={() => confirmRemoveItem()}
                product={productToDel}
            />
        </div>
    );
}