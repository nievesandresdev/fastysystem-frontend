import { GlobeAmericasIcon } from '@heroicons/react/24/solid'
import { NumberedListIcon } from '@heroicons/react/24/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import { BookOpenIcon } from '@heroicons/react/24/solid'
import { PresentationChartLineIcon } from '@heroicons/react/24/solid'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid'
import { useLocation, Link } from 'react-router-dom'
import { useAppSelector } from '@/hooks/store';
import { 
    REPORT_ROUTES,
    BILLER_ROUTES,
    SETTING_ROUTES,
    PRODUCT_ROUTES,
    CLOSURE_ROUTES
} from '@/routes/names';



export default function MainMenu(){
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAppSelector(s => s.auth);
    const { current: currExchange} = useAppSelector(s => s.exchange);
    
    return (
        <div className="flex-grow bg-gray-1">
            <div className="flex py-2 pl-4 gap-2">
                <Link 
                    className={`${currentPath == REPORT_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-22 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={REPORT_ROUTES.ROOT}
                >
                    <GlobeAmericasIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">REPORTE</h1>
                </Link>
                <Link
                    className={`${currentPath == BILLER_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-22 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={BILLER_ROUTES.ROOT}
                >
                    <NumberedListIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">FACTURAR</h1>
                </Link>
                <Link 
                    className={`${currentPath == SETTING_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-22 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={SETTING_ROUTES.ROOT}
                >
                    <Cog6ToothIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">CONFIG</h1>
                </Link>
                <Link 
                    className={`${currentPath == PRODUCT_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-22 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={PRODUCT_ROUTES.ROOT}
                >
                    <BookOpenIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">INVENTARIO</h1>
                </Link>
                <Link 
                    className={`${currentPath == CLOSURE_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-22 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={CLOSURE_ROUTES.ROOT}
                >
                    <PresentationChartLineIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">CIERRE</h1>
                </Link>

                {currExchange?.exchange && 
                    (
                    <div className="flex-grow flex justify-start gap-2">
                        <div className="bg-black-1 rounded-[4px] px-4">
                            <h1 className="text-xs text-yellow-1 font-bold pt-1">Cotizacion del <br/>Dia:</h1>
                            <h1 className="text-xl text-yellow-1 font-bold text-right">{currExchange?.exchange.toFixed(2)} Bs</h1>
                        </div>
                        <div className="bg-red-1 rounded-[4px] py-2 px-4">
                            <UserCircleIcon className="size-6 text-yellow-1 mx-auto" />
                            <h1 className="text-xs text-yellow-1 font-bold text-center leading-4">Operador:</h1>
                            <h1 className="text-sm uppercase text-yellow-1 font-bold text-center leading-4">{user?.name}</h1>
                        </div>
                    </div>
                    )
                }
                <button className="text-base font-semibold text-blue-600 hover:bg-gray-200 cursor-pointer mt-auto mr-1 bg-blue-100 p-1.5 rounded-md flex items-center gap-1">
                    <ArchiveBoxXMarkIcon className="size-6 mx-auto" />
                    Cerrar sesion
                </button>
            </div>
        </div>
    );
}