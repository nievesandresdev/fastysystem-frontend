import { ConfirmModal } from '@/components/General'
import { InputAmount, CTAButton, SelectInput, MsgError } from "@/components/General";
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from "react";
import { useApiQuery } from '@/hooks/useApi';
import { Coin, getCoinsApi } from '@/api/exchange.service.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { saveExchange, findActive } from '@/stores/exchange/exchangeActions.ts';
import { toast } from "react-toastify";


type ExchangeSettingProps = {  
    isOpen: boolean;
    onClose: () => void;  
};

const initialForm = {
    coinId: "",
    exchange: "",
};

export default function ExchangeSetting({ isOpen, onClose}: ExchangeSettingProps) {   
    const dispatch = useAppDispatch();
    const { current: currExchange, loading : loadExchange, error : errorExchange} = useAppSelector(s => s.exchange);
    const [formData, setFormData] = useState(initialForm);
    
    const { data: coinsList, loading, error } = useApiQuery<Coin[]>(() => getCoinsApi());
    
    useEffect(() => {
        const load = async () => {
            if (!currExchange) {
            await dispatch(findActive());
            }
        };
        load();
    },[])

    const coinsData = coinsList?.data;
    const coinsOptions = coinsData?.length ? coinsData?.map(coin => ({
        value: coin.id.toString(), 
        label: `${coin.name} (${coin.abbreviation})` 
    })) : [];
    //OPTION DEFAULT
    if(coinsOptions.length && !formData.coinId.trim()){
        const defaultUnit = coinsOptions.find(unit => unit.label == "Dolar (USD)");
        setFormData(prev => ({ ...prev, coinId: defaultUnit.value }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (): void => {
        const data = { ...formData, coinId: Number(formData.coinId)};
        const { meta, payload } = await dispatch(saveExchange(data));

        if (meta.requestStatus === 'fulfilled') {
            toast.success('Tasa actualizada correctamente');
            onClose();
        }
    };
    return (
    <ConfirmModal  
        isOpen={isOpen} 
        title={!currExchange ? "Crear tasa" : "Actualizar tasa"} 
        onClose={onClose}
        contentClassName="min-w-[400px]"
    >
        <div>
            {(currExchange && <h2 className="text-xl font-semibold mb-4">Tasa actual : {currExchange?.exchange} Bs</h2>)}
            <SelectInput
                label="Unidad de Medición"
                name="coinId"
                value={formData.coinId}
                options={coinsOptions}
                placeholder="Selecciona una unidad"
                onChange={handleChange}
            />
            <div className="my-4"></div>
            <InputAmount 
                label="Ganancia (porcentaje)" 
                name="exchange"
                value={formData.exchange}
                onChange={handleChange}
                placeholder="30.00"
                coin="Bs"
            />
        </div>
        {/* {submitError && <MsgError message={submitError?.data?.data?.error?.message || 'Error el guardar'} />} */}
        <div className="mt-4">
            <CTAButton 
                extraClassName="ml-auto px-4 py-2 text-sm font-semibold"
                onClick={submit}
                disabled={!Number(formData.exchange)}
            >
                <BookmarkSquareIcon className="size-4"/>
                {(!currExchange ? "Guardar" : "Actualizar")}
            </CTAButton>
        </div>
    </ConfirmModal>
    );
}