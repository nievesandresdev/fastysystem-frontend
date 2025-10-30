import { 
    GlobeAmericasIcon,
    NumberedListIcon,
    Cog6ToothIcon,
    BookOpenIcon,
    PresentationChartLineIcon,
    UserCircleIcon,
    ArchiveBoxXMarkIcon,
    DocumentMinusIcon
} from '@heroicons/react/24/solid'
//
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/hooks/store';
import { logout } from '@/stores/auth/authSlice';
import { AUTH_ROUTES } from '@/routes/names';
import { 
    REPORT_ROUTES,
    BILLER_ROUTES,
    SETTING_ROUTES,
    PRODUCT_ROUTES,
    CLOSURE_ROUTES,
    EXPENSE_ROUTES
} from '@/routes/names';



export default function MainMenu(){
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentPath = location.pathname;
    const { current: currExchange} = useAppSelector(s => s.exchange);
    const { user } = useAppSelector(s => s.auth);
    // Obtener roles del usuario desde Redux
    const hasAdminRole = user?.roles?.includes('admin') || false;
    const handleLogout = async () => {
        try {
            // Limpiar authVault (token y roles)
            await window.authVault?.clear?.();
            
            // Dispatch logout action
            dispatch(logout());
            
            // Navegar al login
            navigate(AUTH_ROUTES.LOGIN, { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    
    return (
        <div className="flex-grow bg-gray-1">
            <div className="flex py-2 pl-4 gap-2">
                <Link 
                    className={`${currentPath == REPORT_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={REPORT_ROUTES.ROOT}
                >
                    <GlobeAmericasIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-xs font-semibold text-yellow-1">TABLERO</h1>
                </Link>
                <Link
                    className={`${currentPath == BILLER_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={BILLER_ROUTES.ROOT}
                >
                    <NumberedListIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-xs font-semibold text-yellow-1">FACTURAR</h1>
                </Link>
                {hasAdminRole && (
                    <Link 
                        className={`${currentPath == SETTING_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                        to={SETTING_ROUTES.ROOT}
                    >
                        <Cog6ToothIcon className="size-8 mx-auto text-yellow-1" />
                        <h1 className="text-xs font-semibold text-yellow-1">CONFIG</h1>
                    </Link>
                )}
                <Link 
                    className={`${currentPath == PRODUCT_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={PRODUCT_ROUTES.ROOT}
                >
                    <BookOpenIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-xs font-semibold text-yellow-1">INVENTARIO</h1>
                </Link>
                <Link 
                    className={`${currentPath == CLOSURE_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={CLOSURE_ROUTES.ROOT}
                >
                    <PresentationChartLineIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">CIERRES</h1>
                </Link>
                <Link 
                    className={`${currentPath == EXPENSE_ROUTES.ROOT ? 'bg-orange-1' : 'bg-blue-1'} w-20 hover-bg-orange-1 shadow-1 rounded-[4px] py-1.5 text-center cursor-pointer`}
                    to={EXPENSE_ROUTES.ROOT}
                >
                    <DocumentMinusIcon className="size-8 mx-auto text-yellow-1" />
                    <h1 className="text-sm font-semibold text-yellow-1">GASTOS</h1>
                </Link>

                {currExchange?.exchange && 
                    (
                    <div className="flex-grow flex justify-start gap-2">
                        <div className="bg-black-1 rounded-[4px] px-2">
                            <h1 className="text-xs text-yellow-1 font-bold pt-1">Cotizacion <br/> actual:</h1>
                            <h1 className="text-lg text-yellow-1 font-bold text-right">{currExchange?.exchange.toFixed(2)} Bs</h1>
                        </div>
                        <div className="bg-red-1 rounded-[4px] py-2 px-2">
                            <UserCircleIcon className="size-5 text-yellow-1 mx-auto" />
                            <h1 className="text-xs text-yellow-1 font-bold text-center leading-4">Operador:</h1>
                            <h1 className="text-xs uppercase text-yellow-1 font-bold text-center leading-4">{user?.name}</h1>
                        </div>
                    </div>
                    )
                }
                <button 
                    className="text-base font-semibold text-blue-600 hover:bg-gray-200 cursor-pointer mt-auto mr-1 bg-blue-100 p-1.5 rounded-md flex items-center gap-1"
                    onClick={handleLogout}
                >
                    <ArchiveBoxXMarkIcon className="size-6 mx-auto" />
                    Cerrar sesion
                </button>
            </div>
        </div>
    );
}