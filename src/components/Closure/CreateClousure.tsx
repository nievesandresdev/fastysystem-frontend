import { XCircleIcon } from '@heroicons/react/24/solid'
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { Modal, InputText } from "../General";
import { useState } from "react";

type CreateClousureProps = {
    isOpen: boolean;        
    onClose: () => void;
}

export default function CreateClousure({ isOpen, onClose }: CreateClousureProps) {

    const [formData, setFormData] = useState({
        period: "",
        num_product_sales: 0,
        sales_detail: [],
        number_of_bills: "",
        quote: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    return (
        <Modal 
            title="Cerrar periodo" 
            isOpen={isOpen} 
            onClose={onClose}
            styles={{contentWidth:"w-[60%]"}}
        >
            <div className="grid grid-cols-3 gap-4">
                
                <InputText 
                    label="Descripcion de la factura" 
                    name="description_bill"
                    value={formData.description_bill}
                    onChange={handleChange}
                    placeholder="Ej: Jose"
                />
                <InputText 
                    label="Descripcion real detalada" 
                    name="description_real"
                    value={formData.description_real}
                    onChange={handleChange}
                    placeholder="Ej: Jose"
                />
                <InputText 
                    label="Precio Bolivares" 
                    name="price_bs"
                    value={formData.price_bs}
                    onChange={handleChange}
                    placeholder="Ej: Perez"
                />
                <InputText 
                    label="Precio Dolares" 
                    name="price_quote"
                    value={formData.price_quote}
                    onChange={handleChange}
                    placeholder="Ej: joseperez123"
                />
                <InputText 
                    label="Cantidad en Stock" 
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Ej: joseperez123@gmail.com"
                />
                <InputText 
                    label="Minimo stock para alertar" 
                    name="min_stock"
                    value={formData.min_stock}
                    onChange={handleChange}
                    placeholder="********"
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60">
                    <XCircleIcon className="size-7 text-yellow-1"/>
                        CANCELAR
                </button>
                <button className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60">
                    <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                        GUARDAR
                </button>
            </div>
        </Modal>
    );

    
}

