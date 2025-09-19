import { XCircleIcon } from '@heroicons/react/24/solid'
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { Modal, InputText, SelectInput, InputAmount, MsgError, ToggleInput } from "@/components/General";
import { HandleStockFields } from "@/components/Product";
import { useState, useEffect } from "react";
import { MeasurementUnit, saveProductApi  } from '@/api/product.service';
import { useApiMutation } from '@/hooks/useApi';
import { useAppSelector } from '@/hooks/store';
import { toast } from "react-toastify";

const initialForm = {
    active: true,
    codigo: "",
    name: "",
    description: "",
    priceCExchange: "",
    markup:"30.00",
    priceRExchange: "",
    priceCLocal: "",
    priceRLocal: "",
    typeStockId: "",
    stock: "",
    minStock: "",
};

type ProductFormData = typeof initialForm & { id?: number };


type CreateProductProps = {
    isOpen: boolean;        
    onClose: () => void;
    unitsData: MeasurementUnit;
    productToEdit?: ProductFormData;
    reloadList?: () => void;
}
export default function ProductForm({ isOpen, onClose, unitsData = [], productToEdit, reloadList }: CreateProductProps) {

    const { current: currExchange } = useAppSelector(s => s.exchange);
    const [formData, setFormData] = useState<ProductFormData>(productToEdit ?? initialForm);
    const { run, loading, error, data } = useApiMutation(saveProductApi);
    //calculo de precios
    const markupPrice = formData.priceCExchange * (formData.markup/100);
    const retailPrice = Number(markupPrice) + Number(formData.priceCExchange);
    formData.priceRExchange = String(formData?.priceCExchange).trim() ? retailPrice.toFixed(2)  : "";
    formData.priceCLocal = currExchange?.exchange ? (Number(formData.priceCExchange) * Number(currExchange?.exchange)).toFixed(2) : formData.priceCLocal;
    formData.priceRLocal = currExchange?.exchange ? (Number(formData.priceRExchange) * Number(currExchange?.exchange)).toFixed(2) : formData.priceRLocal;
    //

    useEffect(() => {
        setFormData(productToEdit ?? initialForm);
    }, [productToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const unitsOptions = unitsData ? unitsData?.map(unit => ({
        value: unit.id.toString(), // Convertir a string (los valores de select son strings)
        label: `${unit.name} (${unit.abbreviation})` // "Metros (m)"
    })) : [];

    if(unitsOptions.length && !formData.typeStockId){
        const defaultUnit = unitsOptions.find(unit => unit.label == "Unidad (und)");
        setFormData(prev => ({ ...prev, typeStockId: defaultUnit.value }));
    }
    
    const submit = async ():void => {
        const res = await run(formData);
        if(res.ok){
            toast.success(res.message);
            cancel();
            reloadList?.();
        }
    };

    const cancel = (): void => {
        setFormData(initialForm);
        onClose();
    }
    return (
        <Modal 
            title={productToEdit ? "Editar producto" : "Crear producto"} 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[60%]"}}
        >
            {productToEdit && (<div>
                <ToggleInput 
                    label="Activar/Desactivar producto"
                    name="active"
                    value={!!formData.active} // asegurar booleano
                    onChange={(e) =>
                        setFormData((prev) => ({
                        ...prev,
                        active: e.target.checked,
                        }))
                    }
                />
            </div>)}
            <div className="grid grid-cols-3 gap-4">
                {/* Code */}
                <InputText 
                    label="Codigo del producto" 
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    placeholder="Ej: 7591058001024"
                />
                {/* Name */}
                <div className="col-span-2">
                    <InputText 
                        label="Nombre del producto (Use palabras clave)" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Baso Blan manaplas"
                        maxLength="30"
                    />
                </div>
                {/* Prices & markup */}
                <div className="flex items-center gap-4 col-span-3">
                    <InputAmount 
                        label="Precio divisas (Costo)" 
                        name="priceCExchange"
                        value={formData.priceCExchange}
                        onChange={handleChange}
                        placeholder="0.00"
                        coin={currExchange?.coinSymbol}
                    />
                    <InputAmount 
                        label="Ganancia (porcentaje)" 
                        name="markup"
                        value={formData.markup}
                        onChange={handleChange}
                        placeholder="30.00"
                        coin="%"
                    />
                    <InputAmount 
                        label="Precio divisas (Venta)" 
                        name="priceRExchange"
                        value={formData.priceRExchange}
                        onChange={handleChange}
                        placeholder="0.00"
                        coin={currExchange?.coinSymbol}
                        disabled
                    />
                    
                </div>
                <div className="flex items-center gap-4 col-span-3">
                    <InputAmount 
                        label="Precio bolivares (Costo)" 
                        name="priceCLocal"
                        value={formData.priceCLocal}
                        onChange={handleChange}
                        placeholder="0.00"
                        coin="Bs"
                        disabled
                    />
                    <InputAmount 
                        label="Precio bolivares (Venta)" 
                        name="priceRLocal"
                        value={formData.priceRLocal}
                        onChange={handleChange}
                        placeholder="0.00"
                        coin="Bs"
                        disabled
                    />
                    
                </div>
                {/* description */}
                <div className="col-span-3">
                    <InputText 
                        label="Descripcion del producto" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ej: Baso con tapa manaplas para bebidas"
                    />
                </div>
                {/* Measure unit */}
                <SelectInput
                    label="Unidad de Medición"
                    name="typeStockId"
                    value={formData.typeStockId}
                    options={unitsOptions}
                    placeholder="Selecciona una unidad"
                    onChange={handleChange}
                />
                <HandleStockFields 
                    formData={formData} 
                    onChange={handleChange} 
                    unitsData={unitsData}
                />
            </div>
            {error && <MsgError message={error?.data?.data?.error?.message || 'Error el guardar'} />}
            <div className="mt-4 flex items-center justify-between">
                <button 
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={cancel}
                    disabled={loading}
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                        CANCELAR
                </button>
                <button 
                    className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={submit}
                    disabled={loading}
                >
                    <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                        { loading ? "ENVIANDO": "GUARDAR"}
                </button>
            </div>
        </Modal>
    );

    
}

