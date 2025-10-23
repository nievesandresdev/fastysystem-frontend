// Footer.tsx
import { BookmarkSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useAppSelector, useAppDispatch  } from "@/hooks/store";
import { totalLocal, totalExchange } from "@/stores/sale/saleSelectors";
import { saveSale  } from "@/stores/sale/saleActions.ts";
import { resetClientForm  } from "@/stores/client/clientSlice.ts";
import { toast } from "react-toastify";

export default function Footer({ validSale, payments, change, onClose }) {
   const dispatch = useAppDispatch();
  const { data: client } = useAppSelector((s) => s.client);
  const { items: itemslist } = useAppSelector((s) => s.sale);
  const { current: currExchange } = useAppSelector((s) => s.exchange);

  const totalLocalValue = useAppSelector(totalLocal);
  const totalExchangeValue = useAppSelector(totalExchange);

  const handleSave = () => {
    dispatch(saveSale({
      clientId: client?.id ?? null,
      exchangeId: currExchange?.id ?? 0,
      itemslist,
      payments,
      change,
      totalLocal: totalLocalValue,
      totalExchange: totalExchangeValue
    })).unwrap().then((res) => {
      console.log('test res',res)
      dispatch(resetClientForm(client));
      onClose(); 
      toast.success("Venta realizada!");
    }).catch((err) => {
      console.error("Error guardando venta", err);
    });
  };

  return (
    <div className="p-2 flex justify-between">
      <button 
        className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover:bg-black-1 w-60 hover:bg-black-100"
        onClick={onClose}
      >
        <XCircleIcon className="size-7 text-yellow-1" />
        CANCELAR
      </button>
      <button
        type="submit"
        className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover:bg-black-1 w-60"
        disabled={!itemslist?.length || !validSale}
        onClick={handleSave}
      >
        <BookmarkSquareIcon className="size-7 text-yellow-1" />
        REALIZAR VENTA
      </button>
    </div>
  );
}
