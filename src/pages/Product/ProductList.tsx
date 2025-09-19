import { FolderArrowDownIcon } from '@heroicons/react/24/solid'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { FolderMinusIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { EqualsIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
//
import { ProductForm } from '@/components/Product';
import { FlexTable, Pagination, Spinner, InputText } from '@/components/General';
import { useEffect, useState } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { useAppSelector } from '@/hooks/store';
import { type MeasurementUnit, type ProductWithUnit, type ProductListFilters, getMeasurementUnitsApi, getAllProductsApi, deleteProductApi  } from '@/api/product.service';
import { toast } from "react-toastify";

export default function ProductList() {
    
    const { current: currExchange } = useAppSelector(s => s.exchange);
    const [isCreateProductModalOpen, setCreateProductModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [dataEdit, setDataEdit] = useState<object | null>(null);
    // filters list
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(8)
    const [onlyActive, setOnlyActive] = useState(true)
    const [latest, setLatest] = useState(false)
    const [lowStock, setLowStock] = useState(false)
    const [search, setSearch] = useState("")
    const defaultFilters :ProductListFilters = {page: 1, perPage: 8, onlyActive: true, lowStock: false, latest: false, search: ""};
    const filters :ProductListFilters = {page, perPage, onlyActive, lowStock, latest, search};
    //
    //*
    //async
    //*
    const { data: units, loading, error } = useApiQuery<MeasurementUnit[]>(() => getMeasurementUnitsApi());
    const { data: products, loading : productsLoading, error: productsError, refetch } = useApiQuery<ProductWithUnit[]>(() => getAllProductsApi(filters), [page, perPage, onlyActive, latest, lowStock, search]);
    const { run, loading : loadDelete, error : deleteError } = useApiMutation(deleteProductApi);
    const someLoading = loading || productsLoading || loadDelete;
    //
    //*
    //useEffect
    //*
    // debounce para search
    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.length >= 3) {
                toggleFilter({ ...filters, search });
            } else {
                toggleFilter({ ...filters, search: "" });
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);
    // obtener data de producto seleccionado
    useEffect(() => {
        // 
        let dataSelected = products?.data.data.find(p => p.id === selectedRow) || null;
        // console.log('test dataSelected', dataSelected);
        if(dataSelected){
            dataSelected = {
                id: dataSelected.id,
                codigo: dataSelected.codigo ,
                name: dataSelected.name ,
                description: dataSelected.description ,
                priceCExchange: dataSelected.priceCExchange ,
                markup: dataSelected.markup,
                priceRExchange: dataSelected.priceRExchange ,
                priceCLocal: dataSelected.priceCLocal ,
                priceRLocal: dataSelected.priceRLocal ,
                typeStockId: dataSelected.typeStockId ,
                stock: dataSelected.stock ,
                minStock: dataSelected.minStock,
                active: Boolean(dataSelected.active)
            };
            
            setDataEdit(dataSelected);
        }
    }, [selectedRow]);
    //
    //*
    //Methods
    //*
    const selectRow = (id: number) =>{
        setSelectedRow(id);
    }

    const toggleFilter = (filtersParam):void =>{
        setPerPage(filtersParam.perPage);
        setOnlyActive(filtersParam.onlyActive);
        setLowStock(filtersParam.lowStock);
        setLatest(filtersParam.latest);
        setPage(1);
    }

    const restFilters = ():void =>{
        toggleFilter(defaultFilters)
        setSearch("");
        setSelectedRow(null);
    }

    const reloadList = ():void =>{
        refetch();
        setSelectedRow(null);
        setDataEdit(null);
    }

    const createProductModalOpen = ():void =>{
        setSelectedRow(null);
        setDataEdit(null);
        setCreateProductModalOpen(true)
    }
    
    const delProduct = async ():void => {
        const res = await run(Number(selectedRow));
        if(res.ok){
            toast.success(res.message);
            reloadList();
        }
    };
    return (
        <>
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1 pb-14">
            <div className="bg-gray-1 px-4 border-b-3 border-yellow-1 pb-3 flex items-start sticky top-0 left-0 z-10">
                <div>
                    <h1 className="text-xl font-semibold">Inventario</h1>
                    <div className="flex items-center gap-1 mt-1">
                        <CheckCircleIcon className="size-7 text-green-500" />
                        <p className="text-base italic text-green-500 leading-5 font-semibold pr-1">Selecciona un producto para <br/> habilitar mas opciones</p>
                    </div>
                </div>
                {/* search */}
                <div className="h-full border-l-3 border-yellow-1 ml-auto px-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold">Buscar:</h1>
                        <button 
                            className="px-2 rounded-[4px] text-sm py-0.5 font-semibold shadow-1 mt-auto cursor-pointer flex items-center justify-start gap-2 hover-bg-gray-2 bg-white mb-auto"
                            onClick={() => restFilters()}
                        >
                            <ArrowPathIcon className="size-5"/>
                            Resetear filtros
                        </button>
                    </div>
                    <div className="relative pb-3 w-100 mt-1">
                        <InputText 
                            name="name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            extraClassInput="pl-9"
                        />
                        <MagnifyingGlassIcon className="size-6 absolute bottom-5 left-2"/>
                    </div>
                </div>
                {/* filters */}
                <div className="h-full border-l-3 border-yellow-1 ml-auto px-4">
                    <h1 className="text-lg font-semibold">Ordenar por:</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <button 
                            className={`px-2 rounded-[4px] text-base py-1 font-semibold shadow-1 mt-auto cursor-pointer flex items-center justify-start gap-2 ${ !latest ? 'hover-bg-gray-2 bg-white' : 'bg-green-500 text-white'}`}
                            onClick={() => toggleFilter({...filters, latest: !latest})}
                        >
                            <FolderArrowDownIcon className="size-6"/>
                            Ultimos
                        </button>
                        <button 
                            className={`px-2 rounded-[4px] text-base py-1 font-semibold shadow-1 mt-auto cursor-pointer flex items-center justify-start gap-2 ${ !lowStock ? 'hover-bg-gray-2 bg-white' : 'bg-green-500 text-white'}`}
                            onClick={() => toggleFilter({...filters, lowStock: !lowStock})}
                        >
                            <FolderMinusIcon className="size-6"/>
                            Poco Stock
                        </button>
                    </div>
                </div>
                {/* options */}
                <div className="border-l-3 border-yellow-1 ml-auto pl-4">
                    <h1 className="text-lg font-semibold">Opciones:</h1>
                    <div className="flex gap-2 mt-1">
                        <button 
                            className="rounded-[4px] text-yellow-1 text-base py-1 font-semibold bg-blue-2 hover-bg-black-1 mt-auto cursor-pointer flex items-center justify-center gap-1 px-1 shadow"
                            disabled={!selectedRow || someLoading}
                            onClick={()=> setCreateProductModalOpen(true)}
                        >
                            <PencilSquareIcon className="size-6"/>
                            Actualizar
                        </button>
                        <button 
                            className="rounded-[4px] text-yellow-1 text-base py-1 font-semibold bg-red-1 hover-bg-black-1 mt-auto cursor-pointer flex items-center justify-center gap-1 px-1 shadow"
                            disabled={!selectedRow || someLoading}
                            onClick={() => delProduct()}
                        >
                            <TrashIcon className="size-6"/>
                            Eliminar
                        </button>
                        <button 
                            className="rounded-[4px] text-yellow-1 text-base py-1 font-semibold bg-blue-1 hover-bg-black-1 cursor-pointer flex items-center justify-center gap-1 px-1"
                            onClick={()=> createProductModalOpen()}
                        >
                            <PlusCircleIcon className="size-6"/>
                            Crear producto
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-4 pt-1" style={{minHeight: "calc(100vh - 250px)"}}>
                {/* priceCExchange,priceCLocal,priceRExchange,priceRLocal */}
                <FlexTable
                    columns={[
                        { 
                            key: "codigo", label: "CODIGO", className: "w-[10%] bg-gray-100",
                            render: (p) => (<p className="text-base content-center h-full leading-4">{p.codigo}</p>)
                        },
                        {
                            key: "name", label: "NOMBRE", className: "flex-grow bg-blue-100",
                            render: (p) => (<p className="text-base content-center text-left font-bold">{p.name}</p>)
                        },
                        {
                            key: "priceCExchange", label: "PRECIO COSTO", className: "w-[8%] bg-orange-100",
                            render: (p) => (
                                <div>
                                    <p className="text-base leading-4 text-right font-bold bg-yellow-200">{p.priceCExchange.toFixed(2)} {currExchange?.coinSymbol}</p>
                                    <p className="text-base leading-4 text-right bg-orange-200">{Number(p.priceCLocal).toFixed(2)} Bs</p>
                                </div>
                            )
                        },
                        {
                            key: "markup", label: "GANANCIA", className: "w-[6%] bg-orange-100", render: (p) => p.markup+"%"
                        },
                        {
                            key: "priceCExchange", label: "PRECIO VENTA", className: "w-[8%] bg-blue-100",
                            render: (p) => (
                                <div>
                                    <p className="text-base leading-4 text-right font-bold bg-yellow-200">{Number(p.priceRExchange).toFixed(2)} {currExchange?.coinSymbol}</p>
                                    <p className="text-base leading-4 text-right bg-orange-200">{Number(p.priceRLocal).toFixed(2)} Bs</p>
                                </div>
                            )
                        },
                        {
                            key: "stock", label: "STOCK", className: `w-[4%] ${lowStock ? 'bg-red-400' : 'bg-blue-100'}`,
                        },
                        {
                            key: "minStock", label: <>MIN <br />STOCK</>, className: "w-[4%] bg-blue-100",
                        },
                        {
                            key: "created_at", label: <>FECHA DE<br />REGISTRO</>, className: `w-[7%] ${latest ? 'bg-red-400' : 'bg-gray-100'}`, render: (p) => new Date(p.created_at).toLocaleDateString(),
                        },
                        {
                            key: "updated_at", label: <>ACTUALIZADO<br />EL</>, className: "w-[8%] bg-gray-100", render: (p) => new Date(p.updated_at).toLocaleDateString(),
                        },
                        { 
                            key: "active", label: "ACTIVO", className: "w-[5%] bg-gray-100", 
                            render: (p) => !p.active ? <XCircleIcon className="size-7 text-red-500 m-auto" /> : <CheckCircleIcon className="size-7 text-green-500 m-auto" />
                        }
                    ]}
                    data={products?.data.data ?? []}
                    isLoading={productsLoading}
                    selectedRow={selectedRow}
                    selectRowFn={selectRow}
                    currentPage={page}
                    numRows={perPage}
                />
            </div>
            {/* 🚀 Paginación abajo de la tabla */}
            {Boolean(products?.data.data.length) && (
                <div className="bg-gray-1 flex justify-between items-center px-4 fixed bottom-0 left-0 w-full shadow">
                    <h2 className="text-base font-semibold"> 
                        <span className="text-3xl text-red-1 font-bold">{products?.data?.total ?? 0} </span>
                        Productos en lista:
                    </h2>
                    <div className="border-l-3 border-yellow-1 flex gap-4 pl-2 ml-4 items-center">
                        <h2 className="text-base font-semibold">Productos por pagina:</h2>
                        <button 
                            className={`px-3 py-1 rounded cursor-pointer shadow ${perPage == 8 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({...filters, perPage:8})}
                        >
                            8 
                        </button>
                        <button 
                            className={`px-3 py-1 rounded cursor-pointer shadow ${perPage == 12 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({...filters, perPage:12})}
                        >
                            12
                        </button>
                    </div>
                    <div className="border-l-3 border-yellow-1 mr-auto ml-8 pl-4 flex gap-4">
                        <button 
                            className={`flex items-center font-semibold gap-2 px-2 py-1 rounded-md shadow cursor-pointer  ${ onlyActive ? 'bg-green-500 text-white':'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({...filters, onlyActive:true})}
                        >
                            <CheckCircleIcon className="size-7 m-auto" />
                            Solo productos activos
                        </button>
                        <button 
                            className={`flex items-center font-semibold gap-2 px-2 py-1 rounded-md shadow cursor-pointer  ${ !onlyActive ? 'bg-green-500 text-white':'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({...filters, onlyActive:false})}
                        >
                            <EqualsIcon className="size-7 m-auto" />  
                            Todos los productos
                        </button>
                    </div>
                    <Pagination
                        page={products.data.page}
                        totalPages={products.data.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </section>
        <ProductForm 
            isOpen={isCreateProductModalOpen} 
            onClose={() => setCreateProductModalOpen(false)} 
            unitsData={units?.data}
            reloadList={reloadList}
            productToEdit={dataEdit}
        />
        </>
    );
}