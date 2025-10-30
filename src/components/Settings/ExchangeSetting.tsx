import { ConfirmModal } from '@/components/General'
import { InputAmount, CTAButton, SelectInput, MsgError } from "@/components/General";
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from "react";
import { useApiQuery } from '@/hooks/useApi';
import { getCoinsApi, type Coin } from '@/api/exchange.service.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { saveExchange, findActive } from '@/stores/exchange/exchangeActions.ts';
import { setIsExchangeSettingOpen } from '@/stores/exchange/exchangeSlice';
import { toast } from "react-toastify";


type ExchangeSettingProps = {  
    isOpen: boolean;
};

const initialForm = {
    coinId: "",
    exchange: "",
};

export default function ExchangeSetting({ isOpen }: ExchangeSettingProps) {   
    const dispatch = useAppDispatch();
    const { current: currExchange, error: exchangeError } = useAppSelector(s => s.exchange);
    const [formData, setFormData] = useState(initialForm);
    console.log('exchangeError', exchangeError);
    const { data: coinsList } = useApiQuery(() => getCoinsApi());
    
    useEffect(() => {
        const load = async () => {
            if (!currExchange) {
            await dispatch(findActive());
            }
        };
        load();
    },[])

    const coinsData = coinsList?.data;
    const coinsOptions = coinsData?.length ? coinsData?.map((coin: any) => ({
        value: String(coin.id), 
        label: `${coin.name} (${coin.abbreviation})` 
    })) : [];
    //OPTION DEFAULT
    useEffect(() => {
        if(coinsOptions.length && !formData.coinId.trim()){
            const defaultUnit = coinsOptions.find((unit) => unit.label === "Dolar (USD)");
            if(defaultUnit){
                setFormData(prev => ({ ...prev, coinId: defaultUnit.value }));
            }
        }
    }, [coinsOptions.length]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        dispatch(setIsExchangeSettingOpen(false));
    };

    const submit = async (): Promise<void> => {
        const data = { 
            coinId: Number(formData.coinId), 
            exchange: Number(formData.exchange) 
        };
        const { meta } = await dispatch(saveExchange(data));

        if (meta.requestStatus === 'fulfilled') {
            toast.success('Tasa actualizada correctamente');
            handleClose();
            setFormData(initialForm);
        }
    };
    return (
    <ConfirmModal  
        isOpen={isOpen} 
        title={!currExchange ? "Crear tasa" : "Actualizar tasa"} 
        onClose={handleClose}
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
                onChange={handleSelectChange}
            />
            <div className="my-4"></div>
            <InputAmount 
                label="Ganancia (porcentaje)" 
                name="exchange"
                value={formData.exchange}
                onChange={handleInputChange}
                placeholder="30.00"
                coin="Bs"
            />
        </div>
        {exchangeError && <MsgError message={exchangeError} />}
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