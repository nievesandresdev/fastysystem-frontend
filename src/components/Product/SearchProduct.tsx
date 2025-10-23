import { XCircleIcon } from '@heroicons/react/24/solid'
//
import { useApiQuery } from '@/hooks/useApi';
import { type ProductWithUnit } from '@/api/product.service.ts';
import { searchProductApi } from '@/api/product.service.ts';
import { useAppSelector } from "@/hooks/store";
// 
import { useState, useEffect } from 'react'
//
import { InputText } from "@/components/General";

interface Props {
    disabled: boolean;
    onProductSelect: () => void;
}

export default function SearchProduct({ disabled = false, onProductSelect }:Props){
    const [isResultsOpen, setIsResultsOpen] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    //
    const { data, loading } = useApiQuery<ClientForm[]>(() => searchProductApi(searchValue),[searchValue],{ debounce: 300 });
    const { current: currExchange} = useAppSelector(s => s.exchange);

    const products = data?.data;
    useEffect(()=>{
        setIsResultsOpen(true)
    },[searchValue])

    const handleSelectProduct = (product) => {
        console.log('product',product)
        setIsResultsOpen(false)
        setSearchValue("")
        onProductSelect(product);
    };

    return (
        <div className="relative">
            <InputText 
                label="Agregar productos" 
                name="document"
                extraClassInput="pl-9 text-lg uppercase font-semibold pr-1"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="busca por nombre o codigo del producto......"
                disabled={disabled}
            />
            {/* clean */}
            { searchValue && (
                <XCircleIcon 
                    className="size-6 absolute top-[30px] right-3 cursor-pointer"
                    onClick={() => setSearchValue("")}
                />
            )}
            {/* list */}
            <div className="bg-zinc-100 w-full top-15 left-0 absolute z-[900] shadow-xl rounded-b-[4px]">
                { isResultsOpen && products?.length > 0 && products.map((p)=>{
                    return(
                    <div 
                        key={p.id} className="p-1 border-b border-gray-300 flex gap-2 hover:bg-gray-300 cursor-pointer px-3"
                        onClick={() => handleSelectProduct(p)}
                    >
                        <h1 className="text-base uppercase font-bold bg-yellow-100 rounded">{p.codigo}</h1>
                        <h1 className="text-base uppercase font-bold">{p.name}</h1>
                        <h1 className="text-base uppercase font-bold ml-auto w-24 text-right">{p.priceRExchange} {currExchange?.coinSymbol}</h1>
                        <h1 className="text-base uppercase font-bold w-2">-</h1>
                        <h1 className="text-base uppercase font-bold w-28 text-right">{p.priceRLocal} Bs</h1>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}